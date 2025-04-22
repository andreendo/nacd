const http = require('http');

const server = new http.Server((req, res) => {
    req.on('error', () => {
        console.log('error');
    });

    res.write('hi', () => {
        console.log('write');
    });
    res.end(() => {
        console.log('end');
    });
});

server.listen(8080, () => {
    http.get('http://localhost:8080').on('close', () => {
        console.log('end of get');
        server.close();
    });
});