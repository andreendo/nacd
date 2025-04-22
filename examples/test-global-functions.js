const { isProxy } = require('util').types;
require('fs');

isNaN();

console.log(isProxy(isNaN));

console.log(eval('1 + 2'));

console.log(isProxy(global));
global.isFinite();
global.setImmediate(() => 1)

process.nextTick(() => 1);