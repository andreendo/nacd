const fs = require('fs');

const fsWatch = fs.watch('/tmp', { encoding: 'buffer' }, (eventType, filename) => {
    if (filename) {
        console.log(filename);
    }
});

fsWatch.on('close', () => {
    console.log('closing watch');
});

fsWatch.on('error', () => {
    console.log('error');
});

fsWatch.on('change', () => {
    console.log('change');
});

setTimeout(() => fsWatch.close(), 2000);