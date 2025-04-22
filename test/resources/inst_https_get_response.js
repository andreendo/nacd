const https = require('https');
const clientRequest = https.get('https://nodejs.org/dist/index.json');
let rawData = '';
clientRequest.on('response', (response) => {
    response.on('data', (chunk) => {
        rawData += chunk;
    });
    response.on('end', () => {
        JSON.parse(rawData);
    })
    response.on('close', () => {});
});
