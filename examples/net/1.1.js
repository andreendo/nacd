const net = require('net');

const server = net.createServer(function (connection) {
    console.log('client connected');
});

server.listen(8080, function () {
    const socket1 = net.Socket(); // no new here
    socket1.connect({ port: 8080 }, () => {
        console.log('connected to server');
        process.exit();
    });
});