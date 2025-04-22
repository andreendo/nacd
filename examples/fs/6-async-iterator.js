const fs = require('fs');

async function print(readable) {
    readable.setEncoding('utf8');
    let data = '';
    for await (const chunk of readable) {
        data += chunk;
    }
    console.log(data);
}

print(fs.createReadStream('./package.json')).catch(console.error);