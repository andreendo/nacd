const fs = require('fs');
const promisify = require('util').promisify;

const stat = promisify(fs.stat);

stat('./package.json').then((stats) => {
    console.log(stats.size);
});