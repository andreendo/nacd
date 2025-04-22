const NodeAsyncModel = require('../../lib/model/nodeasyncmodel');
const chai = require('chai');

const expect = chai.expect;
const model = new NodeAsyncModel();

describe('NodeAsyncModel', function () {
    it('should have async classes and properties', function () {
        let numberOfProperties = 0;
        for (m of model.modules.keys()) {
            numberOfProperties += model.modules.get(m).length;
        }

        expect(model.modules.size).to.be.gte(46);  // values at the paper submission's date
        expect(numberOfProperties).to.be.gte(424);
    });

    it('should work single inheritance', function () {
        const serverResponse = model.getAsyncProperties('http.ServerResponse');
        model.getAsyncProperties('EventEmitter')
            .forEach(prop => {
                expect(serverResponse.find(p => p.name === prop.name)).to.not.be.null;
            });
    });

    it('should work multiple inheritance', function () {
        const duplex = model.getAsyncProperties('stream.Duplex');
        model.getAsyncProperties('stream.Readable')
            .forEach(prop => {
                expect(duplex.find(p => p.name === prop.name)).to.not.be.null;
            });
        model.getAsyncProperties('stream.Writable')
            .forEach(prop => {
                expect(duplex.find(p => p.name === prop.name)).to.not.be.null;
            });
    });

    it('should work different levels of inheritance', function () {
        const httpServer = model.getAsyncProperties('http.Server');
        model.getAsyncProperties('EventEmitter')
            .forEach(prop => {
                expect(httpServer.find(p => p.name === prop.name)).to.not.be.null;
            });
        model.getAsyncProperties('net.Server')
            .forEach(prop => {
                expect(httpServer.find(p => p.name === prop.name)).to.not.be.null;
            });

        httpServer.filter(prop => typeof prop.eventSpecificObjects !== 'undefined')
            .forEach(prop => {
                // 5 from http.Server and 1 from net.Server = 6
                expect(prop.eventSpecificObjects).to.have.lengthOf(6);
            });
    });

    it('should handle eventSpecificObjects', function () {
        const netServer = model.getAsyncProperties('net.Server');
        const eventProps = ['on', 'addListener', 'prependListener', 'prependOnceListener', 'once'];
        netServer
            .filter(prop => eventProps.includes(prop.name))
            .forEach(p => expect(p.eventSpecificObjects).to.be.an('array'));
    });

    it('should handle http.ClientRequest eventSpecificObjects', function () {
        const clientRequest = model.getAsyncProperties('http.ClientRequest');
        const eventProps = ['on', 'addListener', 'prependListener', 'prependOnceListener', 'once'];
        clientRequest
            .filter(prop => eventProps.includes(prop.name))
            .forEach(p => {
                expect(p.eventSpecificObjects).to.be.an('array');
            });
    });
});