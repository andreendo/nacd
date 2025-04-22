const fs = require('fs');

function callback() {
    console.log('callback');
}

fs.stat('./package.json', callback);
fs.readFile('./package.json', callback);