const { Resolver } = require('dns');
const resolver = new Resolver();

resolver.resolve4('example.org', (err, addresses) => {
    console.log(addresses);
});