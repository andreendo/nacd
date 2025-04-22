const http = require('http');

const clientRequest = http.get('http://nodejs.org/dist/index.json', (res) => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
        console.log('data');
        rawData += chunk;
    });

    res.on('end', () => {
        try {
            JSON.parse(rawData);
            console.log('success');
        } catch (e) {
            console.error(e.message);
        }
    });
});

clientRequest.on('error', (e) => {
    console.error(`Got error: ${e.message}`);
});
