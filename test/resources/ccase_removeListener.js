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
    
    const close = () => {
        console.log('close');
    };
    response.on('close', close);
    response.removeListener('close', close);
});