const dns = require('dns');

dns.resolve4('example.org', (err, addresses) => {
    if (err) throw err;
});