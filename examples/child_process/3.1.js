const { exec } = require('child_process');
const child = exec('node --version', (err, stdout, stderr) => {
    if (err) throw err;

    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});

child.on('close', () => {
    console.log('**close');
});