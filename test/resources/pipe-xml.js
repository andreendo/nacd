const fs = require('fs');
const expat = require('node-expat');
const parser = new expat.Parser('UTF-8');

const startTime = Date.now();

parser.on('startElement', function (name, attrs) {
    console.log('startElement', Date.now() - startTime);
});

parser.on('endElement', function (name) {
    console.log('endElement', Date.now() - startTime);
});

parser.on('error', function (name) {
    console.log('error', Date.now() - startTime);
});

fs.createReadStream('./test/resources/example.xml', { highWaterMark: 1024 })
    .pipe(parser);