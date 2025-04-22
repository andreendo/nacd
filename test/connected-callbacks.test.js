const _ = require('lodash');
const expect = require('chai').expect;
const { prepare, readActionsFromLogFile, exec } = require('./helper');

describe('Connected callbacks: nacd', function () { 
    this.timeout(100000);
    
    beforeEach(prepare);

    it('should deal fs.createReadStream', function () {
        _.times(5, () => {
            const res = exec(`nacd plain2 node test/resources/ccb_fs_createReadStream.js`);
            const actions = readActionsFromLogFile();

            expect(res.stderr).to.be.equal(''); 
            expect(actions.length).to.be.greaterThan(10);
            const readStreamOps = actions.filter(a => a.operation === 'direct delay');
            expect(readStreamOps.length).to.be.equal(actions.length - 10);
        });
    });

    it('should deal new net.Server (cb passed is also connected)', function () {
        _.times(5, () => {
            const res = exec(`nacd plain2 node test/resources/ccb_net_Server.js`);
            const actions = readActionsFromLogFile();

            expect(res.stderr).to.be.equal('');
            expect(actions).to.have.lengthOf(19);
        });
    });

    it('should deal net.Server (cb passed is also connected)', function () {
        _.times(5, () => {
            const res = exec(`nacd plain2 node test/resources/ccb_net_Server_2.js`);
            const actions = readActionsFromLogFile();

            expect(res.stderr).to.be.equal('');
            expect(actions).to.have.lengthOf(19);
        });
    });

    it('should deal net.createServer (cb passed is also connected)', function () {
        _.times(5, () => {
            const res = exec(`nacd plain2 node test/resources/ccb_net_createServer.js`);
            const actions = readActionsFromLogFile();

            expect(res.stderr).to.be.equal('');
            expect(actions).to.have.lengthOf(19);
        });
    });

    it('should deal callback object', function () {
        _.times(5, () => {
            const res = exec(`nacd plain2 node test/resources/ccb_http_get.js`);
            const actions = readActionsFromLogFile();

            expect(res.stderr).to.be.equal('');
            expect(actions.length).to.be.greaterThan(6);
        });
    });

    it('should deal property object', function () {
        _.times(5, () => {
            exec(`nacd plain2 node test/resources/ccb_child_process.js`);
            const actions = readActionsFromLogFile();

            expect(actions.length).to.be.greaterThan(5);
        });
    });
});