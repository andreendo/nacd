/*
This example shows the instrumentation (type 'cb') does not work with promises.
When the 'then' callback is delayed, it returns undefined (not the expecter stat.size).

For 'cb' type to work, we will need to deal with promises together with the 
default callback instrumentation.

Better solution: intercept the settlement of the promise returned by stat.
*/

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