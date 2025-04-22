// This example shows the current implementation does not work (type cb).
// When the then cb is delayed, it returns undefined.
// For the current version, we will need to deal with promises 
// together with the callback instrumentation.

// Better solution: intercept the settlement of the promise returned by stat.

const fsPromises = require('fs').promises;

fsPromises.stat('./package.json')
    .then((stat) => {
        return stat.size;
    })
    .then((size) => {
        console.log('size:', size);
    })
    .catch((e) => {
        console.log(e);
    });