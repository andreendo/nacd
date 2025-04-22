const fsPromises = require('fs').promises;

for (const p in fsPromises) {
    console.log(p);
}