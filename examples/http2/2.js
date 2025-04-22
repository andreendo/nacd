const http2 = require('http2');

// Create an unencrypted HTTP/2 server
const server = http2.createServer();

server.on('stream', (stream, headers) => {
    stream.respond({
        'content-type': 'text/html',
        ':status': 200
    });
    stream.on('error', (error) => { console.error(error) });
    stream.end('<h1>Hello World</h1>');
});

server.listen(8089, () => {
    console.log("now listening..");
    const client = http2.connect("http://localhost:8089");
    const req = client.request();
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => data += chunk);
    req.on('end', () => {
        console.log(`The server says: ${data}`);
        client.close();
    });
});

// kill the server after 1s
setTimeout(() => {
    process.exit();
}, 1000);