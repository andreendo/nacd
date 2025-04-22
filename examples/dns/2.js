const { resolve } = require('dns').promises;

resolve('example.org2')
    .then(addresses => {
        console.log(addresses);
    })
    .catch(err => {
        console.log(err);
    });