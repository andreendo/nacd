const fs = require('fs');

const writeStream = fs.createWriteStream('./writestream.log');

writeStream.write('data 1');
writeStream.write('data 2');
writeStream.end('data 3');