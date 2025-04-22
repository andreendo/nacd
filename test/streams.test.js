const expect = require('chai').expect;
const { prepare, readActionsFromLogFile, exec } = require('./helper');

describe('ReadStream and pipes: nacd', function () {
    this.timeout(20000);

    beforeEach(prepare);

    it('should deal piping unzip2 library', function () {
        exec(`nacd plain2 node test/resources/pipe-unzip2.js`);
        const dd_actions = readActionsFromLogFile()
            .filter((action) => action.operation === 'direct delay');
        expect(dd_actions.length).to.be.greaterThan(1);
    });

    it.skip('should deal piping node-expat library', function () {
        exec(`nacd plain2 node test/resources/pipe-xml.js`);
        const dd_actions = readActionsFromLogFile()
            .filter((action) => action.operation === 'direct delay');
        expect(dd_actions.length).to.be.greaterThan(5);
    });
});

describe('WriteStream: nacd', function () {
    this.timeout(20000);

    beforeEach(prepare);

    it('should deal file writable streams', function () {
        exec(`nacd plain2 node test/resources/stream_fileWriteStream.js`);
        const actions = readActionsFromLogFile();
        expect(actions).to.have.lengthOf(12);
        expect(actions.filter(a => a.function === '_write'))
            .to.have.lengthOf(2);
        expect(actions.filter(a => a.function === '_writev'))
            .to.have.lengthOf(1);
        expect(actions.filter(a => a.function === '_final'))
            .to.have.lengthOf(1);
    });
});

describe('Transform streams: nacd', function () {
    this.timeout(20000);

    beforeEach(prepare);

    it('should deal transform streams - crypto', function () {
        exec(`nacd plain2 node test/resources/stream_transform_crypto.js`);
        const actions = readActionsFromLogFile();
        expect(actions.length).to.be.greaterThan(6);
        expect(actions.filter(a => a.function === '_transform'))
            .to.have.lengthOf(1);
    });
});

describe('Duplex streams: nacd', function () {
    this.timeout(20000);

    beforeEach(prepare);

    it.skip('should deal duplex streams', function () {
        // ??
    });
});