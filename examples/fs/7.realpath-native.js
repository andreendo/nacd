const fs = require('fs');

fs.realpath.native('./package.json', (err, resolvedPath) => {
    if (err) throw err;

    console.log(resolvedPath);
});