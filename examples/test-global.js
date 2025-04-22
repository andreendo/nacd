/* eslint-disable */

console.log(global === root);
console.log(global === GLOBAL);

console.log(__defineGetter__ === global.__defineGetter__);
console.log(__defineSetter__ === global.__defineSetter__);
console.log(__lookupGetter__ === global.__lookupGetter__);
console.log(__lookupSetter__ === global.__lookupSetter__);
console.log(__proto__ === global.__proto__);
console.log(hasOwnProperty === global.hasOwnProperty);
console.log(isPrototypeOf === global.isPrototypeOf);
console.log(propertyIsEnumerable === global.propertyIsEnumerable);
console.log(toLocaleString === global.toLocaleString);
console.log(toString === global.toString);
console.log(valueOf === global.valueOf);
console.log(constructor === global.constructor);

let url = new URLSearchParams();