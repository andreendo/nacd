const {
    randomBoolean,
    randomUpTo,
    collectCurrentStackTrace } = require('../../util');

class DelayInjector {
    constructor(db, instrumenter) {
        this.db = db;
        this.instrumenter = instrumenter;
        this.active = true;                 // default
        this.always = false;                // default
        this.queuesMap = new Map();
    }

    decideDelay() {
        if (!this.active) return { delayed: false, timeout: 0 };

        if (this.always) return { delayed: true, timeout: randomUpTo(500) };
        
        return { delayed: randomBoolean(), timeout: randomUpTo(500) };
    }

    handleCallbacks(args, registrationID, info, passedLogObject) {
        const self = this;
        const index = args.findIndex((arg) => typeof arg === 'function');
        if (index === -1) return false;

        const objectID = info.objectID;  //keep imutable value
        args[index] = new Proxy(args[index], {
            apply(target, thisArg, argsList) {
                self.instrumenter.instrumentCallbackObjects(argsList, info, passedLogObject);
                if (info.connectedCallbacks) {
                    return self.dealWithConnectedCallback({
                        registrationID,
                        objectID,
                        target,
                        thisArg,
                        argsList
                    });
                } else {
                    return self.dealWithSimpleCallback({
                        operation: 'callback run',
                        registrationID,
                        target,
                        thisArg,
                        argsList
                    });
                }
            }
        });

        return true;
    }

    handlePromise(originalPromise, registrationID) {
        const self = this;
        const { delayed, timeout } = self.decideDelay();
        if (delayed) return new Promise((resolve, reject) => {
            originalPromise
                .then(function () {
                    setTimeout(() => resolve(...arguments), timeout);
                })
                .catch(function () {
                    setTimeout(() => reject(...arguments), timeout);
                })
                .finally(() => {
                    self.db.put({
                        operation: 'promise run',
                        registeredBy: registrationID,
                        delayed,
                        timeout,
                        stackTrace: collectCurrentStackTrace()
                    });
                });
        });

        self.db.put({
            operation: 'promise run',
            registeredBy: registrationID,
            delayed,
            stackTrace: collectCurrentStackTrace()
        });
        return originalPromise;
    }

    handleSingleFunction(property, info) {
        const self = this;
        const objectID = info.objectID;
        return new Proxy(property, {
            apply(target, thisArg, argsList) {
                return self.dealWithSimpleCallback({
                    operation: 'direct delay',
                    registrationID: info.name + ', objectID:' + objectID,
                    target,
                    thisArg,
                    argsList
                });
            }
        });
    }

    handleRegistration({ target, thisArg, argsList }, info, logObject) {
        const { delayed, timeout } = this.decideDelay();
        logObject.delayed = delayed;
        const originalID = logObject.ID;
        if (delayed) {
            if (info.type.includes('rp')) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        this.db.put({
                            operation: 'run delayed registration',
                            originalID,
                            timeout,
                            stackTrace: collectCurrentStackTrace()
                        });
                        const origPromise = Reflect.apply(target, thisArg, argsList);
                        origPromise
                            .then(resolve)
                            .catch(reject);
                    }, timeout);
                });
            } else {
                setTimeout(() => {
                    this.db.put({
                        operation: 'run delayed registration',
                        originalID,
                        timeout,
                        stackTrace: collectCurrentStackTrace()
                    });
                    Reflect.apply(target, thisArg, argsList);
                }, timeout);
            }
        } else {
            return Reflect.apply(target, thisArg, argsList);
        }
    }

    dealWithSimpleCallback(cb) {
        const { delayed, timeout } = this.decideDelay();
        const logObject = {
            operation: cb.operation,
            registeredBy: cb.registrationID,
            delayed,
            stackTrace: collectCurrentStackTrace()
        };

        if (delayed) {
            setTimeout(() => {
                logObject.timeout = timeout;
                logObject.stackTrace = collectCurrentStackTrace();
                this.db.put(logObject);
                return Reflect.apply(cb.target, cb.thisArg, cb.argsList);
            }, timeout);
        } else {
            this.db.put(logObject);
            return Reflect.apply(cb.target, cb.thisArg, cb.argsList);
        }
    }

    dealWithConnectedCallback(cb) {
        const queue = this.getQueue(cb.objectID);
        cb.scheduled = false;
        queue.push(cb);
        return this.scheduleFirstOf(queue);
    }

    getQueue(objectID) {
        if (!this.queuesMap.has(objectID)) {
            this.queuesMap.set(objectID, []);
        }

        return this.queuesMap.get(objectID);
    }

    scheduleFirstOf(queue) {
        if (queue.length === 0) return;

        const cb = queue[0];
        if (!cb.scheduled) {
            cb.scheduled = true;
            const { delayed, timeout } = this.decideDelay();
            const logObject = {
                operation: 'callback run',
                registeredBy: cb.registrationID,
                objectID: cb.objectID,
                delayed,
                stackTrace: collectCurrentStackTrace()
            };

            if (delayed) {
                setTimeout(() => {
                    logObject.timeout = timeout;
                    logObject.stackTrace = collectCurrentStackTrace();
                    this.db.put(logObject);
                    Reflect.apply(cb.target, cb.thisArg, cb.argsList);
                    // When actually runs, remove the first and schedule the next
                    queue.shift();
                    this.scheduleFirstOf(queue);
                }, timeout);
            } else {
                this.db.put(logObject);
                Reflect.apply(cb.target, cb.thisArg, cb.argsList);
                // When actually runs, remove the first and schedule the next
                queue.shift();
                this.scheduleFirstOf(queue);
            }
        }
    }
}

module.exports = DelayInjector;