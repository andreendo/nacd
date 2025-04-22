const https = require('https');

// const clientRequest = http.get('http://nodejs.org/dist/index.json');
// const clientRequest = http.get('http://cs.au.dk');
const clientRequest = https.get('https://raw.githubusercontent.com/noderacer/noderacer/master/nodemon.json');
clientRequest.setTimeout(20);
let rawData = '';
clientRequest.on('response', (response) => {
    console.log('client request on response');

    // response.on('readable', () => {
    //     console.log('response on readable');
    // });

    response.on('data', (chunk) => {
        rawData += chunk;

        console.log('-------------');
        console.log('response on data');
        console.log(chunk.toString().length);
        console.log('-------------');
    });

    response.on('end', () => {
        console.log('response on end');
        console.log(rawData);
        JSON.parse(rawData);
    })

    response.on('close', () => {
        console.log('response on close');
    });
});

clientRequest.on('connect', (res, socket, head) => {
    console.log('client request on connect');
});

clientRequest.on('continue', () => {
    console.log('client request on continue');
});

clientRequest.on('information', (info) => {
    console.log('client request on information');
});

clientRequest.on('socket', (socket) => {
    console.log('client request on socket');
});

clientRequest.on('timeout', () => {
    console.log('client request on timeout');
});

clientRequest.on('abort', () => {
    console.error('client request on abort');
});

clientRequest.on('upgrade', (res, socket, upgradeHead) => {
    console.log('client request on upgrade');
});