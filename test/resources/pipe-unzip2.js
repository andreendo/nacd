/*
For this file, _read of the ReadStream is called 2/3 times. 
So, nacd has 2/3 points to inject delays. As such, it has a limited impact 
on delaying the involved callbacks. For this example, it explores fewer 
interleavings than NodeRacer. 

We may argue that nacd's exploration is more realistic with the current file (or setting),
while NodeRacer explores more and takes into account scenarios with different settings.
*/

const fs = require('fs');
const unzip = require('unzip2');

fs.createReadStream('./test/resources/example.zip')
    .pipe(unzip.Parse())
    .on('entry', (entry) => {
        console.log('entry:', entry.path);
    });

fs.readFile('./test/resources/example.zip', (err, data) => {
    console.log('data');
});