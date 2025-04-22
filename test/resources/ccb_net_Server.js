const net = require('net');

let order = 0;

function checkOrder(expected) {
    order++;
    if (order !== expected) throw `error: it expects ${expected}, but got ${order}`;
}

const server = new net.Server(function () {
    checkOrder(3);
    console.log('3 - connected 1');
});

server.on('connection', (conn) => {
    checkOrder(4);
    console.log('4 - connected 2');
});

server.listen(8080, function () {
    checkOrder(1);
    console.log('1 - listening 1');
    const socket1 = net.Socket();
    socket1.connect({ port: 8080 }, () => {
        socket1.end();
        server.close();
    });
});

server.on('listening', (conn) => {
    checkOrder(2);
    console.log('2 - listening 2');
});

server.on('close', () => { 
    checkOrder(5);
    console.log('5 - close');
});