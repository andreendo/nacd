var net = require('net');
var client = net.createConnection({ port: 8080 }, function () {
    console.log('connected to server!');
});

client.on('data', function (data) {
    console.log(data.toString());
    client.end();
});

function free() { }
client.on('free', free);
client.removeListener('free', free);
client.on('close', () => { });
client.on('timeout', () => { });
client.setTimeout(100);

client.on('end', function () {
    console.log('disconnected from server');
});

setTimeout(() => process.exit(), 200);