const fs = require('fs');
const fsPromises = fs.promises;

fs.writeFileSync('./delay-reg3.log', '');

fsPromises.appendFile('./delay-reg3.log', 'first ');
fsPromises.appendFile('./delay-reg3.log', 'second ');

fsPromises.readFile('./delay-reg3.log', 'utf8')
    .then((data) => {
        console.log('read async:', data);
    });