const { resolve } = require('dns').promises;

resolve('example.org')
    .then(records => {
        console.log(records);
    })
    .catch(err => {
        console.log(err);
    });

const foo = async function () {
    const records = await resolve('example.org');
    console.log(records);
};

foo();