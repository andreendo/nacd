const fs = require('fs');

fs.writeFileSync('./delay-reg.log', 'first data');

fs.readFile('./delay-reg.log', 'utf8', (err, data) => {
    if (err) throw err;

    console.log('read async:', data);
});

fs.writeFile('./delay-reg.log', 'second data', () => {
    console.log('write async');
});

fs.readFile('./delay-reg.log', 'utf8', (err, data) => {
    if (err) throw err;

    console.log('read async:', data);
});