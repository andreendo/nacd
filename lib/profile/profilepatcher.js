const { builtinModules, globalFunctions, collectCurrentStackTrace } = require('../util');
const proxyEvalOutsideStrictMode = require('./proxyeval');
const Module = require('module');
const { isProxy } = require('util').types;

class ProfilePatcher {
    constructor(db) {
        this.db = db;
    }

    installProxyForGlobalFunctions() {
        const self = this;
        globalFunctions.forEach(({ mod, func }) => {
            eval(`
                if (!isProxy(${func})) 
                    ${func} = new Proxy(${func}, { apply: self.generateFunctionHandler('${mod}') });
            `);
        });

        proxyEvalOutsideStrictMode(self.generateFunctionHandler('global'));
        return this;
    }

    installProxyForGlobalObjects() {
        const self = this;
        if (!isProxy(global)) {
            global = new Proxy(global, { get: self.generateGetHandler('global') });   // eslint-disable-line no-global-assign
        }

        if (!isProxy(process)) {
            process = new Proxy(process, { get: self.generateGetHandler('process') }); // eslint-disable-line no-global-assign
        }

        return this;
    }

    installProxyForRequire() {
        const self = this;
        // avoid adding proxy again
        if (!isProxy(Module.prototype.require)) {
            Module.prototype.require = new Proxy(Module.prototype.require, {
                apply: self.generateFunctionHandlerForRequire()
            });
        }

        return this;
    }

    generateFunctionHandlerForRequire() {
        const self = this;
        return function (target, thisArg, argumentsList) {
            const actualModule = Reflect.apply(target, thisArg, argumentsList);
            const moduleName = argumentsList[0];
            if (!moduleName.startsWith('.') && moduleName.indexOf('/') === -1)
                self.db.put({
                    operation: 'require',
                    module: moduleName,
                    stackTrace: collectCurrentStackTrace()
                });

            if (builtinModules.includes(moduleName)) {
                return new Proxy(actualModule, { get: self.generateGetHandler(moduleName) });
            }

            return actualModule;
        };
    }

    generateFunctionHandler(objectName) {
        const self = this;

        return function (target, thisArg, argumentsList) {
            const actualResponse = Reflect.apply(target, thisArg, argumentsList);
            self.db.put({
                operation: 'function call',
                module: objectName,
                function: target.name,
                stackTrace: collectCurrentStackTrace()
            });

            return actualResponse;
        };
    }

    generateGetHandler(objectName) {
        const self = this;

        // Proxy handler get (get property)
        return function (target, property, receiver) {
            let value = Reflect.get(target, property, receiver);
            if (typeof value === 'function' && !isProxy(value)) {
                return new Proxy(value, { apply: self.generateFunctionHandler(objectName) });
            }

            return value;
        }
    }

    startRecordingLog() {
        this.db.startRecording();
    }
}

module.exports = ProfilePatcher;