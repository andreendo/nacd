const benchmarksFolder = require('./benchmark-folder');

module.exports = [
    {
        name: 'AKA',
        folder: `${benchmarksFolder}/known-bugs/agentkeepalive-23`,
        command: 'timeout 10 node fuzz_test/triggerRace.js',
        errorMessage: 'ECONNRESET',
        nacdMinimumBugReproRatio: 0.3
    },
    {
        name: 'FPS',
        folder: `${benchmarksFolder}/known-bugs/fiware-pep-steelskin`,
        command: './node_modules/.bin/mocha test/unit/race_simple.js --timeout 50000',
        errorMessage: '0 passing',
        nacdMinimumBugReproRatio: 0.5
    },
    {
        name: 'GHO',
        folder: `${benchmarksFolder}/known-bugs/WhiteboxGhost`,
        command: 'node fuzz_test/add_mock.js',
        errorMessage: 'FAILURE',
        nacdMinimumBugReproRatio: 0.7
    },
    {
        name: 'MKD',
        folder: `${benchmarksFolder}/known-bugs/node-mkdirp`,
        command: 'node fuzz_test/race_subtle.js',
        errorMessage: 'Failed run',
        nacdMinimumBugReproRatio: 0.6
    },
    {
        name: 'NES',
        folder: `${benchmarksFolder}/known-bugs/nes`,
        command: 'node_modules/lab/bin/lab -v test/client_TP.js',
        errorMessage: '1 of 1 tests failed',
        nacdMinimumBugReproRatio: 0.6
    },
    {
        // this bug is a hang (detected with timeout)
        name: 'NLF',
        folder: `${benchmarksFolder}/known-bugs/node-logger-file-1`,
        command: 'timeout 20 node fuzz_test/triggerRace.js 10',
        errorMessage: 'ERROR',
        nacdMinimumBugReproRatio: 0.6
    },
    {
        // this bug is a hang (detected with timeout)
        name: 'SIO',
        folder: `${benchmarksFolder}/known-bugs/socket.io-1862`,
        command: 'timeout 20 node fuzz_test/triggerRace.js',
        errorMessage: 'ERROR',
        nacdMinimumBugReproRatio: 0.1
    },
    {
        name: 'DEL',
        folder: `${benchmarksFolder}/known-bugs/del`,
        command: 'node testissue43.js',
        errorMessage: 'Error: ENOENT:',
        nacdMinimumBugReproRatio: 0.15
    },
    {
        name: 'LST',
        folder: `${benchmarksFolder}/known-bugs/linter-stylint`,
        command: 'node syntetic/test.js',
        errorMessage: 'showing wrong message:',
        nacdMinimumBugReproRatio: 0.25
    },
    {
        name: 'NSC',
        folder: `${benchmarksFolder}/known-bugs/node-simplecrawler-i298`,
        command: 'node merged-test.js',
        errorMessage: 'no enough events performed before',
        nacdMinimumBugReproRatio: 0.40
    },
     {
        name: 'XLS',
        folder: `${benchmarksFolder}/known-bugs/xlsx-extract-v2`,
        command: `./node_modules/mocha/bin/mocha test/tests.js --timeout 20000 -g 'should read all columns and rows'`,
        errorMessage: '0 passing',
        nacdMinimumBugReproRatio: 0.0
    }
];