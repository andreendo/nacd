/* eslint-disable no-global-assign */

setTimeout = new Proxy(setTimeout, {
    apply: function (target, thisArg, argumentsList) {
        console.log('setTimeout');

        return Reflect.apply(target, thisArg, argumentsList);
    }
});

global = new Proxy(global, {
    get: function (target, property, receiver) {
        console.log(`get`);

        return Reflect.get(target, property, receiver);
    }
});

setTimeout(() => console.log('OK'), 2000);

console.log(global.Buffer);