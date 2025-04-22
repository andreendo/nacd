const benchmarksFolder = require('./benchmark-folder');

module.exports = [
    {
        name: 'ME1',
        folder: `${benchmarksFolder}/exploratory/mongo-express`,
        command: `./node_modules/.bin/mocha --exit -t 10000 -R spec test/lib/routers/collectionSpec.js -f "Router collection GET /db/<dbName>/<collection> should return html"`,
        errorMessage: '0 passing',
        nacdMinimumBugReproRatio: 0.3
    },
    {
        name: 'ME2',
        folder: `${benchmarksFolder}/exploratory/mongo-express`,
        command: `./node_modules/.bin/mocha --exit -t 10000 -R spec test/lib/routers/documentSpec.js -f "Router document GET /db/<dbName>/<collection>/<document> should return html"`,
        errorMessage: '0 passing',
        nacdMinimumBugReproRatio: 0.3
    },
    {
        name: 'ME3',
        folder: `${benchmarksFolder}/exploratory/mongo-express`,
        command: `./node_modules/.bin/mocha --exit -t 10000 -R spec test/lib/routers/databaseSpec.js -f "Router database GET /db/<dbName> should return html"`,
        errorMessage: '0 passing',
        nacdMinimumBugReproRatio: 0.3
    },
    {
        name: 'ME4',
        folder: `${benchmarksFolder}/exploratory/mongo-express`,
        command: `./node_modules/.bin/mocha --exit -t 10000 -R spec test/lib/routers/indexSpec.js -f "Router index GET / should return html"`,
        errorMessage: '0 passing',
        nacdMinimumBugReproRatio: 0.3
    },
    {
        name: 'NEDB1',
        folder: `${benchmarksFolder}/exploratory/nedb`,
        command: `./node_modules/.bin/mocha --exit -t 20000 -R spec test/db.test.js -g "ensureIndex can be called before a loadDatabase and still be initialized and filled correctly"`,
        errorMessage: '1 test failed',
        nacdMinimumBugReproRatio: 0.1
    },
    {
        name: 'NEDB2',
        folder: `${benchmarksFolder}/exploratory/nedb`,
        command: `./node_modules/.bin/mocha --exit -t 20000 -R spec test/db.test.js -g "database loading will not work and no data will be inserted"`,
        errorMessage: '1 test failed',
        nacdMinimumBugReproRatio: 0.1
    },
    {
        name: 'ARC',
        folder: `${benchmarksFolder}/exploratory/node-archiver`,
        command: `./node_modules/.bin/mocha --exit -t 10000 -R spec test/archiver.js -f "archiver api #errors should allow continue on stat failing"`,
        errorMessage: '0 passing',
        nacdMinimumBugReproRatio: 0.1
    },
    {
        name: 'OBJ',
        folder: `${benchmarksFolder}/exploratory/objection.js`,
        command: `./node_modules/.bin/mocha --exit -t 10000 -R spec tests/unit/utils.js -g "utils promiseUtils map should not start new operations after an error has been thrown"`,
        errorMessage: '0 passing',
        nacdMinimumBugReproRatio: 0
    }
];