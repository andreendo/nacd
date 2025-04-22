const net = require('net');
const fs = require('fs');

const server = net.createServer(function (socket) {
    socket.setEncoding('utf8');
    socket.on('data', (data) => {
        console.log('message from client:', data);
        socket.write('hello from server');
    });
});

server.listen(8080, function () {
    const client1 = net.createConnection({ port: 8080 }, () => {
        client1.write('msg 1');
    });
    client1.setEncoding('utf8');
    client1.on('data', (data) => {
        console.log('message from server:', data);
    });

    setTimeout(() => {
        const client2 = net.createConnection({ port: 8080 }, () => {
            client2.write('msg 2');
        });
        client2.setEncoding('utf8');
        client2.on('data', (data) => {
            console.log('message from server:', data);
        });
    }, 100);
});

setTimeout(() => process.exit(), 2000);