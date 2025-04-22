process.on('SIGTERM', () => {
    process.exit();
});

process.on('exit', () => {
    console.log('exit');
});

setTimeout(() => { }, 10000);