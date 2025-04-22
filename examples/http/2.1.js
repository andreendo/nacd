const http = require('http');

const clientRequest = http.get('http://nodejs.org/dist/index.json', (res) => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', chunk => rawData += chunk);
    res.on('end', () => {
        JSON.parse(rawData);
        console.log('success');
    });
});

clientRequest.on('close', () => {
    console.log('close');
});
