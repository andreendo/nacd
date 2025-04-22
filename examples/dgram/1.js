const dgram = require('dgram');

// for (const p in dgram) {
//     console.log(p);
// }

// new should not be used. Use createSocket as recommended by the documentation
// const s1 = new dgram.Socket('udp4');

const s3 = dgram.createSocket('udp4');
for (const p in s3) {
    console.log(p);
}