const fs = require('fs');

fs.writeFileSync('./delay-reg2.log', '');

fs.appendFile('./delay-reg2.log', 'first ', () => { });

fs.appendFile('./delay-reg2.log', 'second ', () => { });

fs.readFile('./delay-reg2.log', 'utf8', (err, data) => {
    if (err) throw err;

    console.log('read async:', data);
});