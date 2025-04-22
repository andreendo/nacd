/* Surprisingly NodeRacer can deal with the ordering restrictions related to 
events data, end, and close. The order between 'data' can be found by causal
relationship using async hooks (type FSREQWRAP), and 'end' and 'close' are 
scheduled using process.nextTick() and FSREQWRAP. */

const fs = require('fs');

const readStream = fs.createReadStream('./test/resources/example-package.json', { highWaterMark: 256 });
let rawData = '';
let pkg;
const startTime = Date.now();

readStream.on('data', (chunk) => {
    console.log('data', Date.now() - startTime);
    rawData += chunk;
});

readStream.on('end', () => {
    console.log('end', Date.now() - startTime);
    pkg = JSON.parse(rawData);
});

readStream.on('close', () => {
    console.log('close', Date.now() - startTime);
    pkg.dependencies;
});