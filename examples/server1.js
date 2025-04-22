const net = require('net');

const server = net.createServer(function s_socket(socket) {
    console.log('s_socket');
    socket.on('data', function s_onData(data) {
        console.log('S>>client data: ' + data)
    })
})

server.listen(8080, function s_onListen() {
    console.log('S>>opened server on', server.address())
})

console.log(typeof (server));

setTimeout(() => process.exit(), 500);