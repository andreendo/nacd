/* Surprisingly NodeRacer can deal with the ordering restrictions related to 
events data, end, and close. The order between 'data' can be found by causal
relationship using async hooks (type FSREQWRAP), and 'end' and 'close' are 
scheduled using process.nextTick() and FSREQWRAP. */

const fs = require('fs');

const readStream = fs.createReadStream('./package.json', { highWaterMark: 256 });
let rawData = '';
let pkg;

readStream.on('data', (chunk) => {
    console.log('data');
    rawData += chunk;
});

readStream.on('end', () => {
    console.log('end');
    pkg = JSON.parse(rawData);
});

readStream.on('close', () => {
    console.log('close');
    pkg.dependencies;
});

fs.stat('./package.json', (err, stat) => {
    console.log('stat', stat.size);
});