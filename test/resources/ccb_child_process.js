const { spawn } = require('child_process');
const childProcess = spawn('curl', ['https://nodejs.org/dist/index.json']);

let rawData = '';

childProcess.stdout.on('data', (data) => {
    console.log('stdout: data ');
    rawData += data;
});

childProcess.stdout.on('end', () => {
    console.log('stdout: end');
    JSON.parse(rawData);
});