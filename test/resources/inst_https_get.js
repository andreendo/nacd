const https = require('https');
const clientRequest = https.get('https://nodejs.org/dist/index.json', (res) => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', chunk => rawData += chunk); // several calls
    res.on('end', () => JSON.parse(rawData));
});
clientRequest.on('close', () => { });