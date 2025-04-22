const expect = require('chai').expect;
const { prepare, readActionsFromLogFile, exec } = require('./helper');

describe('Module http2: nacd', function () {
    this.timeout(20000);

    beforeEach(prepare);

    it(`should deal with http2 server and client`, function () {
        exec(`nacd never node test/resources/http2_server_client.js`);
        const actions = readActionsFromLogFile();
        expect(actions.length).to.be.greaterThan(1);
        // expect(actions[0]).to.deep.include({
        //     object: 'https',
        //     function: 'get',
        //     ID: 1
        // });
    });
});