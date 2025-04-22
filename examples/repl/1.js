const repl = require('repl');

// for (const p in repl) {
//     console.log(p);
// }

const r = repl.start();
// r.setupHistory('./history.log', () => {
//     console.log('history');
// });

r.on('exit', () => {
    console.log('exit');
});