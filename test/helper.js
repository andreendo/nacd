const fs = require('fs');
const glob = require('glob');
const shell = require('shelljs');

function readActionsFromLogFile() {
    return JSON.parse(fs.readFileSync(glob.sync('./logs/**/*.json')[0], 'utf8'));
}

function prepare() {
    shell.exec('rm -R logs', { silent: true });
}

function exec(command) {
    return shell.exec(command, { silent: true });
}

module.exports = {
    prepare,
    readActionsFromLogFile,
    exec
}