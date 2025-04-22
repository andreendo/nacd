const http = require('http');

var server = http.createServer(function (req, res) {
    console.log('request');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('hi');
    res.end();
});

server.listen(3000, function () {
    console.log("Server listening on port %d", 3000);
});

setTimeout(() => {
    console.log('call');
    var options = {
        hostname: 'localhost',
        port: 3000,
        path: '/',
        method: 'GET',
        // agent : _keepaliveAgent
    };

    const req = http.request(options, function (res) {
        console.log('here');
        res.on('data', function (chunk) {
            console.log(new Date().getTime() + ': Got data', chunk);
        });
        res.on('end', function () {
            console.log(new Date().getTime() + ': Got end');
        });
    });

    req.on('error', function (e) {
        console.log('Error, problem with request: ', e);
    });
}, 1000);


