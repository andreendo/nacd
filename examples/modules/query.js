const mod = require('cluster');
// const mod = process;

const sync = [];

for (const prop in mod) {
    if (typeof mod[prop] === 'function') {
        if (prop.endsWith('Sync'))
            sync.push(prop);
        else
            console.log(prop);
    }
}

sync.forEach(s => console.log(s));