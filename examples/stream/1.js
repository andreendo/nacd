const fs = require('fs');
const { Writable } = require('stream');

const myWritable = new Writable({
    highWaterMark: 256,
    write(chunk, encoding, callback) {
        console.log('chunk', chunk.length);
        callback();
    },
    final(callback) {
        console.log('final');
        callback();
    }
});

// delay the callback passed to _write 
// console.log(myWritable._write);

const readStream = fs.createReadStream('./package.json', { highWaterMark: 256 });

// 

readStream._read = new Proxy(readStream._read, {
    apply(target, thisArg, argsList) {
        console.log('read');
        setTimeout(() => {
            Reflect.apply(target, thisArg, argsList); // it returns undefined
        }, 1000);
    }
});


readStream
    .pipe(myWritable)
    .on('finish', () => {
        console.log('finish');
    });