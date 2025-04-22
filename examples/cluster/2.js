const cluster = require('cluster');

if (cluster.isMaster) {
    console.log('I am master');
    const w1 = cluster.fork();
    const w2 = cluster.fork();

    cluster.on('fork', () => {
        console.log('fork');
    });

    setTimeout(() => {
        w1.disconnect();
        w2.disconnect();
    }, 2000);
} else if (cluster.isWorker) {
    console.log(`I am worker #${cluster.worker.id}`);
}