const cluster = require('cluster');
const numCPUs = 1;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('fork', (worker) => {        
        // console.log('fork', worker.process.pid);        
        worker.on('online', () => {
            console.log('child online');
        });
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    console.log(`Worker ${process.pid} started`);
    setTimeout(() => {
        process.exit();
    }, 2000);
    
}
