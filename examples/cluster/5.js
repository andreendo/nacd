const cluster = require('cluster');
const numCPUs = 1;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('message', (worker, msg) => {        
        console.log('message', msg, worker.process.pid);        
        worker.on('exit', () => {
            console.log('child exiting');
        });
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    console.log(`Worker ${process.pid} started`);
    process.send('hi');
    setTimeout(() => {
        process.exit();
    }, 2000);
    
}
