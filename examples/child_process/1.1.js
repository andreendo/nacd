const cp = require('child_process');
const n = cp.fork(`${__dirname}/1.2.js`);

console.log(typeof n.send);

n.on('message', (m) => {
    console.log('PARENT got message:', m);
});

// Causes the child to print: CHILD got message: { hello: 'world' }
n.send({ hello: 'world' }, () => {
    console.log('cb from send');
});

setTimeout(() => process.exit(), 1000);