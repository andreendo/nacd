const fs = require('fs');

const readStream = fs.createReadStream('./package.json', { highWaterMark: 256 });

//---------------------------------------------------------
readStream._read = new Proxy(readStream._read, {
    apply(target, thisArg, argsList) {
        // console.log('read');
        setTimeout(() => {
            Reflect.apply(target, thisArg, argsList); // it returns undefined
        }, 1000);
    }
});
//---------------------------------------------------------

async function print(readable) {
    readable.setEncoding('utf8');
    let data = '', counter = 0;
    for await (const chunk of readable) {
        data += chunk;
        console.log(++counter);
    }
    console.log('end');
}

print(readStream).catch(console.error);