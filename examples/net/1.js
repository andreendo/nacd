const net = require('net');

const server = net.createServer(function (connection) {
    connection.on('error', () => {});
    console.log('client connected');
});

server.on('listening', () => {
    console.log('listening');
});

server.listen(8080, function () {
    const socket1 = new net.Socket();
    socket1.connect({ port: 8080 }, () => {
        console.log('connected to server 1');
    });

    setTimeout(() => {
        const socket1 = new net.Socket();
        socket1.connect({ port: 8080 }, () => {
            console.log('connected to server 2');
            process.exit();
        });    
    }, 500);
});