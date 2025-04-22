const tls = require('tls');

// for (const p in tls) {
//     console.log(p);
// }

const socket = new tls.TLSSocket();
socket.on('exit', () => {});