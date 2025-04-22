const { spawn } = require('child_process');
const child = spawn('ls', ['-l', '/usr']);

child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});