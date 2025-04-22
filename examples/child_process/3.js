const { exec, execFile } = require('child_process');
const child = exec('node --version', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});

child.on('exit', () => {
    console.log('**exit 1');
});

const child2 = execFile('node', ['--version'], (error, stdout, stderr) => {
    if (error) throw error;

    console.log(stdout);
});

child2.on('close', () => {
    console.log('**close 2');
});

child2.on('exit', () => {
    console.log('**exit 2');
});