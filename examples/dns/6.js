const { Resolver } = require('dns').promises;

const resolver = new Resolver();

(async function() {
    const addresses = await resolver.resolve('example.org');
    console.log(addresses);
})();