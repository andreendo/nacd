const _ = require('lodash');
const expect = require('chai').expect;
const { prepare, readActionsFromLogFile, exec } = require('./helper');

describe('Corner cases: nacd', function () {
    this.timeout(20000);
    beforeEach(() => prepare());

    it('should deal with using the same function for 2 or more callbacks', function () {
        _.times(5, () => {
            exec(`nacd plain2 node test/resources/oneFunctionTwoCbs.js`);
            const actions = readActionsFromLogFile();
            expect([4, 5, 6]).to.include(actions.length);
            expect(actions[0]).to.deep.include({
                operation: ['async function call'],
                object: 'fs',
                function: 'stat',
                ID: 1
            });
            expect(actions[1]).to.deep.include({
                operation: ['async function call'],
                object: 'fs',
                function: 'readFile',
                ID: 2
            });
            expect(actions.filter(_ => _.operation === 'callback run'))
                .to.have.lengthOf(2);
            if (actions.length > 4) {
                expect(actions.filter(_ => _.operation === 'run delayed registration'))
                    .to.have.length.greaterThan(0);
            }
        });
    });

    it('should deal with Promises (chained promises)', function () {
        _.times(5, () => {
            exec(`nacd plain2 node test/resources/issueWithPromises.js`);
            const actions = readActionsFromLogFile();

            expect([2, 3]).to.include(actions.length);
            expect(actions[0]).to.deep.include({
                operation: ['function returning a promise'],
                object: 'fs.Promises',
                function: 'stat',
                ID: 1
            });
            if (actions.length === 3) { //delayed registration
                const ops = [];
                ops.push(actions[1].operation, actions[2].operation);
                expect(ops).to.include('run delayed registration');
                expect(ops).to.include('promise run');
            } else {
                expect(actions[1]).to.deep.include({
                    operation: 'promise run'
                });
            }
        });
    });

    it('should deal with Promisify', function () {
        exec(`nacd plain2 node test/resources/promisify.js`);
        const actions = readActionsFromLogFile();
        expect(actions).to.have.lengthOf(2);
        expect(actions[0]).to.deep.include({
            operation: ['function returning a promise'],
            object: 'promisify',
            function: 'stat',
            ID: 1
        });
        expect(actions[1]).to.deep.include({
            operation: 'promise run'
        });
    });

    it.skip('should deal with EventEmitter.removeListener()', function () {
        // exec(`nacd plain2 node test/resources/ccase_removeListener.js`);
    });
});