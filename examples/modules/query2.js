const mod = require('cluster');


for (const prop in mod) {
    if (typeof mod[prop] !== 'function') {
        console.log(prop, typeof(mod[prop]));
    }
}

