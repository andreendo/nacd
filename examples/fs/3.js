const fsPromises = require('fs').promises;

// experimenting the instrumentation for promises
fsPromises.stat = new Proxy(fsPromises.stat, {
    apply(target, thisArg, argsList) {
        console.log('log stat');
        const origPromise = Reflect.apply(target, thisArg, argsList);
        return new Promise((resolve, reject) => {
            origPromise
                .then(function () {
                    const myArgs = arguments;
                    setTimeout(() => {
                        resolve(...myArgs);
                    }, 200);
                })
                .catch(function () {
                    const myArgs = arguments;
                    setTimeout(() => {
                        reject(...myArgs);
                    }, 500);
                });
        });
    }
});

fsPromises.stat('./package.json')
    .then((stat) => {
        console.log(stat.size);
    })
    .catch((e) => {
        console.log(e);
    });


fsPromises.stat('./package.json2')
    .then((stat) => {
        console.log(stat.size);
    })
    .catch((e) => {
        console.log(e.code);
    });