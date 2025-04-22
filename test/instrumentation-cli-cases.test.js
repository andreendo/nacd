const expect = require('chai').expect;
const _ = require('lodash');
const { prepare, readActionsFromLogFile, exec } = require('./helper');

describe('Callback object (co) - on some events: nacd', function () {
    this.timeout(20000);

    beforeEach(prepare);

    it(`should deal with ClientRequest.on 'response'`, function () {
        exec(`nacd never node test/resources/inst_https_get_response.js`);
        const actions = readActionsFromLogFile();
        expect(actions[0]).to.deep.include({
            object: 'https',
            function: 'get',
            ID: 1
        });
        expect(actions[1]).to.deep.include({
            object: 'http.ClientRequest',
            function: 'on',
            argument: 'response',
            ID: 2
        });
        expect(actions[3]).to.deep.include({
            object: 'http.IncomingMessage',
            function: 'on',
            argument: 'data'
        });
        expect(actions[4]).to.deep.include({
            object: 'http.IncomingMessage',
            function: 'on',
            argument: 'end'
        });
        expect(actions[5]).to.deep.include({
            object: 'http.IncomingMessage',
            function: 'on',
            argument: 'close'
        });
    });
});

describe('Combining cb, ro, and co: nacd', function () {
    this.timeout(20000);

    beforeEach(prepare);
    
    it('should deal with http.get', function () {
        exec(`nacd never node test/resources/inst_https_get.js`);
        const actions = readActionsFromLogFile();
        expect(actions.length).to.be.greaterThan(8);
        expect(actions[0]).to.deep.include({
            operation: [
                'async function call',
                'function returning an async object',
                'with callback object(s)'
            ],
            object: 'https',
            function: 'get',
            ID: 1
        });
        expect(actions[2]).to.deep.include({
            operation: 'callback run',
            registeredBy: 1
        });
        expect(actions[3]).to.deep.include({
            operation: ['async function call'],
            object: 'http.IncomingMessage',
            function: 'on',
            argument: 'data',
            ID: 3
        });
        expect(actions[4]).to.deep.include({
            operation: ['async function call'],
            object: 'http.IncomingMessage',
            function: 'on',
            argument: 'end',
            ID: 4
        });
    });
});