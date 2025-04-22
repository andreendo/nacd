const {
    asyncModules,
    collectCurrentStackTrace,
    isFromOutsideModules,
    randomBoolean,
    randomUpTo,
    isSync,
    isSyncWithoutCallback
} = require('../../util');
const Module = require('module');
const { isProxy } = require('util').types;

class PlainMode {
    constructor(db) {
        this.db = db;
        this.registrationID = 0;
        this.proxiesCbMap = new Map();
    }

    install() {
        this.installProxyForRequire();
        return this;
    }

    installProxyForRequire() {
        const self = this;
        if (!isProxy(Module.prototype.require)) {
            Module.prototype.require = new Proxy(Module.prototype.require, {
                apply: self.generateFunctionHandlerForRequire()
            });
        }
    }

    generateFunctionHandlerForRequire() {
        const self = this;
        return function (target, thisArg, argumentsList) {
            const actualModule = Reflect.apply(target, thisArg, argumentsList);
            const moduleName = argumentsList[0];
            if (asyncModules.includes(moduleName) && !isProxy(actualModule)) {
                return new Proxy(actualModule, { get: self.generateGetHandler(moduleName) });
            }

            return actualModule;
        };
    }

    generateGetHandler(objectName) {
        const self = this;
        return function (target, property) {
            let value = Reflect.get(target, property);
            if (typeof value === 'function')
                value.bind(target);

            if (typeof value === 'function' &&
                !isProxy(value) &&
                !isSync(objectName, property)) {
                return new Proxy(value, {
                    apply: self.generateFunctionHandler(objectName, property, target)
                });
            }

            return value;
        };
    }

    instrumentArguments(argsList) {
        const self = this;

        let isAsyncFunction = false;
        const cbIndexes = [];
        argsList.forEach((arg, index) => {
            if (typeof arg === 'function') cbIndexes.push(index);
        });

        if (cbIndexes.length > 0) {
            isAsyncFunction = true;
            cbIndexes.forEach((index) => {
                argsList[index] = self.instrumentCallback(argsList[index]);
            });
        }

        return isAsyncFunction;
    }

    instrumentArguments2(args) {
        const self = this;

        const cbIndexes = [];
        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] === 'function') cbIndexes.push(i);
        }

        if (cbIndexes.length > 0) {
            cbIndexes.forEach((index) => {
                args[index] = self.instrumentCallback(args[index], true);
            });
        }

        return args;
    }

    generateFunctionHandler(objectName, functionName, origThisArg) {
        const self = this;

        return function (target, thisArg, argsList) {
            // thisArg may come here as a proxy
            // isProxy(thisArg) returns true
            // thisArg should not be a proxy but original object
            const actualResponse = Reflect.apply(target, origThisArg, argsList);
            // -----------------------------------
            if (`${objectName}.${functionName}` === 'net.createConnection' ||
                `${objectName}.${functionName}` === 'net.connect') {
                if (actualResponse['on'] && typeof actualResponse['on'] === 'function') {
                    // console.log('************HERE');
                    let orig = actualResponse['on'];
                    actualResponse['on'] = function () {
                        // console.log(`${objectName}.${functionName}`, 'on**', arguments[0]);
                        // console.log(collectCurrentStackTrace());
                        const myArguments = self.instrumentArguments2(arguments, origThisArg);
                        self.db.put({
                            operation: 'call to function (maybe indirectly async)',
                            ID: self.registrationID,
                            object: `${objectName}.${functionName}`,
                            function: 'on',
                            stackTrace: collectCurrentStackTrace()
                        });

                        return orig.apply(this, myArguments);
                    }
                }
                return actualResponse;
            }
            // -----------------------------------
            // console.log('------------');        
            // console.log(`${objectName}.${functionName}`);
            if (isFromOutsideModules(collectCurrentStackTrace())) {
                // console.log('*****************')
                return actualResponse;
            }
            
            const isAsyncFunction = self.instrumentArguments(argsList, origThisArg);
            if (isSyncWithoutCallback(objectName, functionName)) {
                return actualResponse;
            }

            if (isAsyncFunction) {
                self.db.put({
                    operation: 'call to async function',
                    ID: self.registrationID,
                    object: objectName,
                    function: functionName,
                    stackTrace: collectCurrentStackTrace()
                });
            } else {
                self.db.put({
                    operation: 'call to function (maybe indirectly async)',
                    object: objectName,
                    function: functionName,
                    stackTrace: collectCurrentStackTrace()
                });
            }

            if (typeof actualResponse === 'object' &&
                !isProxy(actualResponse) &&
                functionName !== '') {
                return new Proxy(actualResponse, {
                    get: self.generateGetHandler(`${objectName}.${functionName}`)
                });
            }

            return actualResponse;
        };
    }

    instrumentCallback(cb, special) {
        const self = this;
        if (isProxy(cb))
            return cb;

        // the functions are internal (leaking to this part)
        const blacklist = [
            'ondrain',
            'socketErrorListener',
            'socketOnData',
            'socketOnEnd',
            'socketCloseListener'
        ];
        if (special && blacklist.includes(cb.name)) {
            // console.log('blacklist**********')
            return cb;
        }

        /*if (self.proxiesCbMap.has(cb)) {
            // console.log(cb.name);
            return self.proxiesCbMap.get(cb);
        }*/

        self.registrationID++;
        const registrationID = self.registrationID;

        const cbProxy = new Proxy(cb, {
            apply(target, thisArg, argsList) {
                if (randomBoolean() && false) {
                    const rTimeout = randomUpTo(500);
                    // delay the callback run
                    setTimeout(() => {
                        self.db.put({
                            operation: 'callback run',
                            registeredBy: registrationID,
                            delayed: true,
                            timeout: rTimeout,
                            stackTrace: collectCurrentStackTrace()
                        });
                        return Reflect.apply(target, thisArg, argsList);
                    }, rTimeout);
                } else {
                    self.db.put({
                        operation: 'callback run',
                        registeredBy: registrationID,
                        delayed: false,
                        stackTrace: collectCurrentStackTrace()
                    });

                    return Reflect.apply(target, thisArg, argsList);
                    // return target.call(thisArg, argsList);
                }
            }
        });
        self.proxiesCbMap.set(cb, cbProxy);
        return cbProxy;
    }

    startRecordingLog() {
        this.db.startRecording();
    }
}

module.exports = PlainMode;