/* eslint-disable */

Map = new Proxy(Map, {
    // get: function (target, property, receiver) {
    //     console.log(`get`);

    //     return Reflect.get(target, property, receiver);
    // }
    construct(target, args) { 
        console.log(`new`);

        return new target(...args);
    }
});


let arr = new Map();

console.log(arr);
console.log(Buffer === require('buffer').Buffer);

console.log(global.toString === toString);