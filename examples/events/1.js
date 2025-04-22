const EventEmitter = require('events');

class MyEmitter extends EventEmitter { }

const myEmitter = new MyEmitter();

for (const prop in myEmitter) {
    if (typeof myEmitter[prop] === 'function') console.log(prop);
}