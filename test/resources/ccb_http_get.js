const https = require('https');

https.get('https://nodejs.org/dist/index.json', (res) => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', chunk => {
        console.log('data');
        rawData += chunk;
    });
    res.on('end', () => {
        console.log('end');
        JSON.parse(rawData);
    });
});