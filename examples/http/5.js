const https = require('https');
const clientRequest = https.get('https://nodejs.org/dist/index.json');

clientRequest.on('socket', (socket) => {
    console.log('socket');
    socket.on('timeout', () => {
        console.log('timeout');
    });
});

clientRequest.on('response', (response) => {
    console.log('response');
    response.on('close', () => {
        console.log('close');
    });
});

clientRequest.on('finish', () => {
    console.log('finish');
});