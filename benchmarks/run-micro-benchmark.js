const glob = require('glob');
const shell = require('shelljs');

// shell.rm('-R', 'logs');

glob.sync('/home/user/git/noderacer/tests/micro-benchmark/*/*-test.js').forEach(function (test) {
    // console.log(`node ${test}`)
    // shell.exec(`node ${test}`, { silent: false });
    shell.exec(`nacd plain2 node ${test}`, { silent: false });
});