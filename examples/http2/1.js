const http2 = require('http2');

for (let prop in http2) {
    console.log(prop, typeof http2[prop]);
}

// console.log(http2.constants)