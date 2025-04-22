const benchmarksFolder = require('./benchmark-folder');

module.exports = [
    {
        name: 'bluebird',
        folder: `${benchmarksFolder}/open-issues/bluebird-2`,
        command: 'node race.js',
        errorMessage: 'timed out',
        nacdMinimumBugReproRatio: 0
    },
    {
        name: 'express-user',
        folder: `${benchmarksFolder}/open-issues/nodesamples`,
        command: 'node express01/server-test-no-flaky.js',    
        errorMessage: 'error',
        nacdMinimumBugReproRatio: 0.2
    },
    {
        name: 'GPT',
        folder: `${benchmarksFolder}/open-issues/get-port`,
        command: 'node triggerRace.js',
        errorMessage: ' already used',
        nacdMinimumBugReproRatio: 0.4
    },
    {
        name: 'LVS',
        folder: `${benchmarksFolder}/open-issues/live-server-potential-race`,
        command: 'timeout 20 node race-root-dir-test.js',
        errorMessage: 'Error',
        nacdMinimumBugReproRatio: 0.15
    },
    {
        name: 'SIOC',
        folder: `${benchmarksFolder}/open-issues/socket.io-client`,
        command: 'node race.js',
        errorMessage: 'success',
        nacdMinimumBugReproRatio: 0.30
    }
];