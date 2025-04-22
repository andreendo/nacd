// const fs = require('fs');

function foo() {
    console.log('foo');
}

function inst(f) {
    console.log('instrumenting ' + f.name);
    f = function() {
        console.log('inst f');
    }
}

inst(foo);

foo();