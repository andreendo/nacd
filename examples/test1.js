// const fs = require('fs', 'net');

// const { builtinModules } = require('module');
// console.log(builtinModules.filter(x => !/^_|^(internal|v8|node-inspect)\/|\//.test(x))
//     .sort());
// fs.readFile;
// let b = require('../lib/util/builtin-modules');
// require('../lib/util/builtin-modules');
// console.log(b);

const _ = require('lodash');

const arr = ["oc"];

const arr2 = ['oc', 'cb'];

console.log(_.isEqual(arr, ['oc']));
console.log(_.isEqual(arr2, ['oc']));