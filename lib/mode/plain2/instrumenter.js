const { isProxy } = require('util').types;
const _ = require('lodash');
const {
    collectCurrentStackTrace,
    isCalledFromInternalModules
} = require('../../util');
const DelayInjector = require('./delayinjector');
const { SHOW_ERROR_UNDEFINED_PROPERTY } = require('./staticsettings');

class Instrumenter {
    /**
     * @param {DataBase} db 
     * @param {NodeAsyncModel} model 
     */
    constructor(db, model) {
        this.db = db;
        this.model = model;
        this.injector = new DelayInjector(db, this);
        this.registrationID = 0;
        this.objectID = 0;
    }

    reset() {
        this.registrationID = 0;
        this.objectID = 0;
    }

    instrumentObject(modObject, modName, pObjectID) {
        const self = this;
        // define a unique ID for object modObject
        let objectID = typeof pObjectID !== 'undefined' ? pObjectID : ++self.objectID;
        self.model.getAsyncProperties(modName).forEach(p => {
            p.objectID = objectID; // this ID is passed to its properties

            if (typeof modObject === 'undefined') return;

            if (SHOW_ERROR_UNDEFINED_PROPERTY
                && typeof modObject[p.name] === 'undefined'
                && !p.optionalProperty) {
                // control potential errors in the async model
                console.log('NACD ERROR: undefined property:', modName, p.name);
                console.log(new Error().stack);
                process.exit();
            }

            if (typeof modObject[p.name] === 'undefined'
                || modObject[p.name] == null) return;

            if (!Object.getOwnPropertyDescriptor(modObject, p.name) ||
                Object.getOwnPropertyDescriptor(modObject, p.name).writable) {
                modObject[p.name] = self.instrumentProperty(modName, modObject[p.name], p);
            } else {
                // change properties that are not writable
                // TODO: investigate better way to do it
                const originalProp = modObject[p.name];
                try {
                    delete modObject[p.name];
                    modObject[p.name] = self.instrumentProperty(modName, originalProp, p);
                } catch (err) {
                    // non-configurable properties (in Node 12)
                    if (!['createCipher', 'createDecipher'].includes(p.name)) {
                        console.log('NACD ERROR: unexpected non-configurable property:', modName, p.name);
                        console.log(new Error().stack);
                        process.exit();        
                    }

                }
            }
        });

        return modObject;
    }

    instrumentProperty(modName, property, info) {
        if (isProxy(property)) return property;

        // dd - direct delay
        if (_.isEqual(info.type, ['dd'])) {
            return this.injector.handleSingleFunction(property, info);
        }

        // promisify
        if (_.isEqual(info.type, ['promisify'])) {
            return this.instrumentPromisify(property);
        }

        // op - object property 
        if (_.isEqual(info.type, ['op'])) {
            return this.instrumentObject(property, info.AsyncObjectProperty);
        }

        const handler = {};
        // oc - object creation (trap for constructor)
        if (info.type.includes('oc')) {
            handler.construct = this.getConstructTrap(modName, info);
        }

        // all other types, except only oc, have a function call (apply) trap
        if (!_.isEqual(info.type, ['oc'])) {
            handler.apply = this.getApplyTrap(modName, info);
        }

        return new Proxy(property, handler);
    }

    instrumentCallbackObjects(argsList, info, passedLogObject) {
        // co - callback objects
        let callbackObjects = info.callbackObjects;
        if (typeof info.eventSpecificObjects !== 'undefined'
            && typeof passedLogObject !== 'undefined') {
            const matchedEvent = info.eventSpecificObjects
                .find(_ => _.event === passedLogObject.argument); // on('??')
            if (matchedEvent) {
                callbackObjects = matchedEvent.callbackObjects;
            }
        }

        if (typeof callbackObjects !== 'undefined') {
            callbackObjects.forEach((cbObject, index) => {
                if (typeof (argsList[index]) !== 'object') {
                    console.log('NACD Error: unmatching type');
                    process.exit();
                }
                argsList[index] = this.instrumentObject(argsList[index], cbObject);
            });
        }
    }

    instrumentPromisify(property) {
        const self = this;
        return new Proxy(property, {
            apply(target, thisArg, argsList) {
                // the function is a known async function
                if (isProxy(argsList[0])) {
                    const promisifiedFunction = Reflect.apply(target, thisArg, argsList);
                    return self.instrumentProperty('promisify', promisifiedFunction,
                        {
                            name: argsList[0].name,
                            type: ['rp'],
                            postponeRegistration: false
                        });
                }

                return Reflect.apply(target, thisArg, argsList);
            }
        });
    }

    getApplyTrap(modName, info) {
        const self = this;
        return function apply(target, thisArg, argsList) {
            // TODO: check if this will not affect connected cbs
            // we may delay a cb that is related to others registered by internals
            if (isCalledFromInternalModules(collectCurrentStackTrace())
                && !info.allowCallFromInternals) {
                return Reflect.apply(target, thisArg, argsList);
            }

            let instrumentReturnedObject = false;
            let instrumentReturnedPromise = false;
            const logObject = {
                operation: [],
                object: modName,
                function: info.name,
                argument: typeof info.logArg !== 'undefined' ? argsList[info.logArg] : '',
                stackTrace: collectCurrentStackTrace()
            };

            let objectID; // make sure the cb and the returned object have the same ID
            if (info.connectedCallbacks) {
                if (info.type.includes('ro')) {
                    objectID = ++self.objectID;
                    info.objectID = objectID;
                    logObject.objectID = objectID;
                } else {
                    logObject.objectID = info.objectID;
                }
            }

            if (info.type.includes('cb')) {
                logObject.operation.push('async function call');
                logObject.ID = ++self.registrationID;
                logObject.callback = self.injector.handleCallbacks(argsList, self.registrationID, info, logObject);
            }

            if (info.type.includes('ro')) {
                logObject.operation.push('function returning an async object');
                instrumentReturnedObject = true;
            }

            if (info.type.includes('co')) {
                logObject.operation.push('with callback object(s)');
            }

            if (info.type.includes('rp')) {
                logObject.operation.push('function returning a promise');
                if (typeof logObject.ID === 'undefined') logObject.ID = ++self.registrationID;
                instrumentReturnedPromise = true;
            }

            let response;
            if (info.postponeRegistration) {
                response = self.injector
                    .handleRegistration({ target, thisArg, argsList }, info, logObject);
                self.db.put(logObject);
            } else {
                self.db.put(logObject);
                response = Reflect.apply(target, thisArg, argsList);
            }

            // const response = Reflect.apply(target, thisArg, argsList);
            if (instrumentReturnedObject) {
                return self.instrumentObject(response, info.returnedObject, objectID);
            } else if (instrumentReturnedPromise) {
                return self.injector.handlePromise(response, self.registrationID);
            } else {
                return response;
            }
        }
    }

    getConstructTrap(modName, info) {
        const self = this;
        return function construct(target, argsList) {
            if (isCalledFromInternalModules(collectCurrentStackTrace())) {
                return Reflect.construct(target, argsList);
            }

            const logObject = {
                operation: ['constructor returning an async object'],
                object: modName,
                function: info.name,
                stackTrace: collectCurrentStackTrace()
            };

            let objectID; // make sure the cb and the returned object have the same ID
            if (info.connectedCallbacks) {
                objectID = ++self.objectID;
                info.objectID = objectID;
                logObject.objectID = objectID;
            }

            if (typeof info.callbackObjects !== 'undefined') {
                logObject.operation.push('with callback object(s)');
                logObject.ID = ++self.registrationID;
                logObject.callback = self.injector.handleCallbacks(argsList, self.registrationID, info);
            }

            self.db.put(logObject);
            const newObject = Reflect.construct(target, argsList);
            return self.instrumentObject(newObject, info.returnedObject, objectID);
        }
    }
}

module.exports = Instrumenter;