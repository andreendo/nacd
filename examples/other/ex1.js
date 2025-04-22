const rp = require('request-promise-native');

rp('http://www.google.com')
    .then((htmlString) => {
        console.log('google.com', htmlString.length);
    })
    .catch((err) => {
        console.log(err);
    });

rp('http://example.com/')
    .then((htmlString) => {
        console.log('example.com', htmlString.length);
    })
    .catch((err) => {
        console.log(err);
    });