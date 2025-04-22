const { resolve } = require('dns');

resolve('www.example.org', (err, addresses) => {
    if (err) throw err;

    console.log(addresses);
});