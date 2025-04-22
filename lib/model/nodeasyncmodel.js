const { cloneDeep } = require('lodash');
const model = require('./modules');

class NodeAsyncModel {
    constructor() {
        this._solveModel();
    }

    _solveModel() {
        this.modules = new Map();
        const solved = [], unsolved = [];
        model.forEach(m => {
            if (typeof m.properties === 'undefined') m.properties = [];

            if (typeof m.is === 'undefined') {
                this.modules.set(m.moduleName, m.properties);
                solved.push(m.moduleName);
            } else {
                unsolved.push(m);
            }
        });

        while (unsolved.length > 0) {
            const m = unsolved.shift();
            if (this._isAllSolved(m.is, solved)) {
                let eventSpecificObjects = m.eventSpecificObjects;
                m.is.forEach(otherModule => {
                    const parent = this._getFullObject(otherModule);
                    if (typeof parent.eventSpecificObjects !== 'undefined') {
                        if (typeof eventSpecificObjects === 'undefined') {
                            eventSpecificObjects = parent.eventSpecificObjects;
                        } else {
                            parent.eventSpecificObjects.forEach(eo => {
                                if (typeof eventSpecificObjects.find(eo2 => eo2.event === eo.event) === 'undefined')
                                    eventSpecificObjects.push(cloneDeep(eo));
                            });
                        }
                    }

                    // cloning objects as in some modules they will have other properties
                    m.properties.push(...cloneDeep(this.getAsyncProperties(otherModule)));
                });

                if (typeof eventSpecificObjects !== 'undefined')
                    this._propagateEventSpecificObjectsToEventListeners(m, eventSpecificObjects);

                this.modules.set(m.moduleName, m.properties);
                solved.push(m.moduleName);
            } else {
                unsolved.push(m); // try to solve it later
            }
        }
    }

    _propagateEventSpecificObjectsToEventListeners(mod, eventSpecificObjects) {
        const eventProps = ['on', 'addListener', 'prependListener', 'prependOnceListener', 'once'];
        mod.properties.forEach(prop => {
            if (eventProps.includes(prop.name)) {
                prop.eventSpecificObjects = eventSpecificObjects;
            }
        });
    }

    _isAllSolved(qModules, solved) {
        for (let i = 0; i < qModules.length; i++)
            if (!solved.includes(qModules[i])) return false;

        return true;
    }

    _getFullObject(moduleName) {
        return model.find(m => m.moduleName === moduleName);
    }

    contains(modName) {
        return this.modules.has(modName);
    }

    getAsyncProperties(modName) {
        return this.modules.get(modName);
    }
}

// This class as a singleton:
// https://medium.com/@maheshkumawat_83392/node-js-design-patterns-singleton-pattern-series-1-1e0ab71e3edf

module.exports = NodeAsyncModel;