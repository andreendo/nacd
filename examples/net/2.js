const net = require('net');

// WITH new here
const server = new net.Server(function (conn) {
    conn.on('error', () => { });
    console.log('client connected');
});

server.listen(8080, function () {
    const socket1 = net.Socket();
    socket1.connect({ port: 8080 }, () => {
        console.log('connected to server');
        socket1.end();
        server.close();
    });
});

server.on('close', () => { 
    console.log('close');
});