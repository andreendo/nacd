const readline = require('readline');

// for (const p in readline) {
//     console.log(p);
// }

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// for (const p in rl) {
//     console.log(p);
// }

rl.on('close', () => {
    console.log('closing');
});

rl.question('What do you think of Node.js? ', (answer) => {
    console.log(`Thank you for your valuable feedback: ${answer}`);
    rl.close();
});