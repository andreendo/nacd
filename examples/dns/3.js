const { resolve } = require('dns').promises;

(async function() {
    const addresses = await resolve('example.org');
    console.log(addresses);
})();