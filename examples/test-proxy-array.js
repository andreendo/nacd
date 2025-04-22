/* eslint-disable */

// Error when using a proxy for Array class

let log = []

Array = new Proxy(Array, {
    get(target, property, receiver) {
        // put a console.log here cause some strange error (infinite loop)
        // console.log(`get`);
        log.push('get');
        return Reflect.get(target, property, receiver);
    },
    construct(target, args) {
        // console.log(`new`);
        log.push('new');
        return new target(...args);
    }
});


let arr = [1, 2, 3];
let arr1 = new Array();
// arr;
// console.log(arr);
console.log(log);