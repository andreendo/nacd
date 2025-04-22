const zlib = require('zlib');

const gzip = zlib.createGzip();
const fs = require('fs');
const inp = fs.createReadStream('./package.json');
const out = fs.createWriteStream('./package.json.gz');

// gzip.flush(() => console.log('flush'));
// gzip.close(() => console.log('close'));
gzip.on('data', () => console.log('gzip on data'));
gzip.on('end', () => console.log('gzip on end'));

inp.once('data', () => {
    console.log('once data input stream');
});

inp.pipe(gzip)
    .on('error', () => {
        console.log('error 1');
    })
    .pipe(out)
    .on('error', () => {
        console.log('error 2');
    });