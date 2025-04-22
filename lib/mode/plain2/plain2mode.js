const Module = require('module');
const { isProxy } = require('util').types;
const NodeAsyncModel = require('../../model/nodeasyncmodel');
const Instrumenter = require('./instrumenter');
const Config = require('../config');

class Plain2Mode {
    constructor(db) {
        this.db = db;
        this.model = new NodeAsyncModel();
        this.instrumenter = new Instrumenter(this.db, this.model, this);
        this.config = new Config();
    }

    install() {
        this.hijackRequire();
        return this;
    }

    uninstall() {
        this.db.mydb = [];
        this.db.record = false;
        this.instrumenter.reset();
        Module.prototype.require = this.originalRequire;
    }

    startRecordingLog() {
        this.db.startRecording();
    }

    hijackRequire() {
        const self = this;
        if (isProxy(Module.prototype.require)) return;

        this.originalRequire = Module.prototype.require;

        Module.prototype.require = new Proxy(Module.prototype.require, {
            apply(target, thisArg, argsList) {
                const modName = argsList[0];
                const modObject = Reflect.apply(target, thisArg, argsList);
                if (!self.model.contains(modName)) {
                    return modObject;
                }

                // Check if it instruments all or just some modules
                if (self.config.restrictModulesInst && 
                    !self.config.restrictedModules.includes(modName)) {
                    return modObject;
                }

                return self.instrumenter.instrumentObject(modObject, modName);
            }
        });
    }
}

module.exports = Plain2Mode;