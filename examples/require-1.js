// const StackTracey = require('stacktracey');
const Module = require('module');

const { require: _require } = Module.prototype;

Module.prototype.require = function (str) {
    let ret = Reflect.apply(_require, this, arguments);
    console.log('require', str);
    if (['http', 'https', 'net', 'fs'].includes(str)) {
        console.log('here');
        ret = new Proxy(ret, {
            get: function (target, property, receiver) {
                console.log(`get`);
                let value = Reflect.get(target, property, receiver);
                if (typeof value === 'function') {
                    return new Proxy(value, {
                        apply: function (target, thisArg, argumentsList) {
                            console.log(`apply ${property}`);
                            // let stack = new StackTracey();
                            // console.log(stack);
                            return Reflect.apply(target, thisArg, argumentsList);
                        }
                    });
                }
                return value;
            }
        });
        return ret;
    }
    return ret;
}
const fs = require('fs');

fs.readFile('../package.json', () => {
    console.log('Read file');
});