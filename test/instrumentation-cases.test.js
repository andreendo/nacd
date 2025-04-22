const Plain2Mode = require('../lib/mode/plain2/plain2mode');
const { DataBase } = require('../lib/util');
const expect = require('chai').expect;
const _ = require('lodash');

let mode, actions;

before(function () {
    mode = new Plain2Mode(new DataBase());
    mode.instrumenter.injector.active = false;  // NO delays here
});

after(function () {
    mode = null;
    actions = null;
});

beforeEach(function () {
    actions = mode.db.mydb;
    mode.install().startRecordingLog();
});

afterEach(function () {
    mode.uninstall();
});

describe('Callback (cb): nacd', function () {
    it('should deal with fs.stat', function (done) {
        const fs = require('fs');
        fs.stat('./package.json', function (err) {
            if (err) done(err);
            expect(actions).to.have.lengthOf(2);
            expect(actions[0]).to.deep.include({
                operation: ['async function call'],
                object: 'fs',
                function: 'stat',
                ID: 1,
                callback: true
            });
            expect(actions[1]).to.deep.include({
                operation: 'callback run',
                registeredBy: 1
            });
            done();
        });
    });

    it('should deal with dns.resolve', function (done) {
        const dns = require('dns');
        dns.resolve4('google.com', function (err) {
            if (err) done(err);
            expect(actions).to.have.lengthOf(2);
            expect(actions[0]).to.deep.include({
                operation: ['async function call'],
                object: 'dns',
                function: 'resolve4',
                ID: 1,
                callback: true
            });
            expect(actions[1]).to.deep.include({
                operation: 'callback run',
                registeredBy: 1
            });
            done();
        });
    });
});

describe('Returned object (ro): nacd', function () {
    it('should deal with fs.createReadStream', function (done) {
        const fs = require('fs');
        const readStream = fs.createReadStream(`./test/resources/test.json`, { highWaterMark: 64 });
        let rawData = '';
        let pkg;

        readStream.on('data', (chunk) => { // called twice
            rawData += chunk;
        });

        readStream.on('end', () => {
            pkg = JSON.parse(rawData);
        });

        readStream.on('close', () => {
            expect(pkg).to.be.an('object');
            expect(actions).to.have.lengthOf(12);
            expect(actions[0]).to.deep.include({
                operation: ['function returning an async object'],
                object: 'fs',
                function: 'createReadStream'
            });
            expect(actions[1]).to.deep.include({
                operation: ['async function call'],
                object: 'stream.Readable',
                function: 'on',
                argument: 'data',
                ID: 1
            });
            expect(actions[2]).to.deep.include({
                operation: ['async function call'],
                object: 'stream.Readable',
                function: 'on',
                argument: 'end',
                ID: 2
            });
            expect(actions[3]).to.deep.include({
                operation: ['async function call'],
                object: 'stream.Readable',
                function: 'on',
                argument: 'close',
                ID: 3
            });
            expect(actions[6]).to.deep.include({
                operation: 'callback run',
                registeredBy: 1
            });
            expect(actions[8]).to.deep.include({
                operation: 'callback run',
                registeredBy: 1
            });
            expect(actions[10]).to.deep.include({
                operation: 'callback run',
                registeredBy: 2
            });
            expect(actions[11]).to.deep.include({
                operation: 'callback run',
                registeredBy: 3
            });

            done();
        });
    });
});

describe('Object creation (oc): nacd', function () {
    it('should deal with dns.Resolver', function (done) {
        const { Resolver } = require('dns');
        const resolver = new Resolver();

        resolver.resolve4('google.com', (err) => {
            if (err) done(err);
            expect(actions).to.have.lengthOf(3);
            expect(actions[0]).to.deep.include({
                operation: ['constructor returning an async object'],
                object: 'dns',
                function: 'Resolver'
            });
            expect(actions[1]).to.deep.include({
                operation: ['async function call'],
                object: 'dns.Resolver',
                function: 'resolve4',
                ID: 1,
                callback: true
            });
            expect(actions[2]).to.deep.include({
                operation: 'callback run',
                registeredBy: 1
            });
            done();
        });
    });
});

describe('Returned promise (rp): nacd', function () {
    it('should deal with dns.promises.resolve4', function (done) {
        const { resolve4 } = require('dns').promises;
        resolve4('google.com').then(function () {
            expect(actions).to.have.lengthOf(2);
            expect(actions[0]).to.deep.include({
                operation: ['function returning a promise'],
                object: 'dns.Promises',
                function: 'resolve4',
                ID: 1
            });
            expect(actions[1]).to.deep.include({
                operation: 'promise run',
                registeredBy: 1
            });
            done();
        });
    });
});

describe('Object property (op): nacd', function () {
    it('should deal with ChildProcess.stdout and ChildProcess.stderr', function (done) {
        const { spawn } = require('child_process');
        const ls = spawn('ls', ['-lh', '/usr']);
        ls.stdout.on('data', () => { });
        ls.stderr.on('data', () => { });
        ls.on('close', () => {
            expect(actions).to.have.lengthOf(7);
            expect(actions[1]).to.deep.include({
                operation: ['async function call'],
                object: 'stream.Readable',
                function: 'on',
                argument: 'data',
                ID: 1
            });
            expect(actions[2]).to.deep.include({
                operation: ['async function call'],
                object: 'stream.Readable',
                function: 'on',
                argument: 'data',
                ID: 2
            });
            expect(actions[4]).to.deep.include({
                operation: 'callback run',
                registeredBy: 1
            });
            done();
        });
    });
});

describe('Callback object (co): nacd', function () {
    it('should deal with https.request', function (done) {
        const https = require('https');
        const options = {
            hostname: 'google.com',
            path: '/',
            method: 'GET'
        };
        const req = https.request(options, (res) => {
            res.on('data', () => { });
            res.on('end', assertions);
        })
        req.end();

        const assertions = () => {
            expect(actions).to.have.lengthOf(8);
            // 3, 4
            expect(actions[0]).to.deep.include({
                operation: [
                    'async function call',
                    'function returning an async object',
                    'with callback object(s)'
                ],
                object: 'https',
                function: 'request',
                ID: 1
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
            done();
        };
    });
});

describe('Callback object (co) - on some events: nacd', function () {
    it(`should deal with ClientRequest.on 'response', 'socket', 'finish'`, function (done) {
        const https = require('https');
        const clientRequest = https.get('https://nodejs.org/dist/index.json');
        clientRequest.on('socket', (socket) => {
            socket.on('timeout', () => { });
        });
        clientRequest.on('response', (response) => {
            response.on('close', () => { });
            expect(actions).to.have.lengthOf(10);
            expect(actions[1]).to.deep.include({
                operation: ['async function call'],
                object: 'http.ClientRequest',
                function: 'on',
                argument: 'socket'
            });
            expect(actions[2]).to.deep.include({
                object: 'http.ClientRequest',
                function: 'on',
                argument: 'response'
            });
            expect(actions[3]).to.deep.include({
                object: 'http.ClientRequest',
                function: 'on',
                argument: 'finish'
            });
            expect(actions[5]).to.deep.include({
                object: 'net.Socket',
                function: 'on',
                argument: 'timeout'
            });
            expect(actions[9]).to.deep.include({
                object: 'http.IncomingMessage',
                function: 'on',
                argument: 'close'
            });
            done();
        });
        clientRequest.on('finish', () => { });
    });
});

describe('Combining oc and ro: nacd', function () {
    it('should deal with net.Socket', function (done) {
        const net = require('net');
        const server = net.createServer();
        server.listen(8080, function () {
            const socket1 = net.Socket(); // NO new here
            socket1.connect({ port: 8080 }, () => {
                socket1.end();
                server.close();
            });
        });
        server.on('close', () => {
            // expect(actions).to.have.lengthOf(13);
            expect(actions[4]).to.deep.include({
                operation: ['function returning an async object'],
                object: 'net',
                function: 'Socket'
            });
            done();
        });
    });

    it('should deal with (new) net.Socket', function (done) {
        const net = require('net');
        const server = net.createServer();
        server.listen(8080, function () {
            const socket1 = new net.Socket(); // WITH new here
            socket1.connect({ port: 8080 }, () => {
                socket1.end();
                server.close();
            });
        });
        server.on('close', () => {
            // expect(actions).to.have.lengthOf(13);
            expect(actions[4]).to.deep.include({
                operation: ['constructor returning an async object'],
                object: 'net',
                function: 'Socket'
            });
            done();
        });
    });
});

describe('Combining cb and ro: nacd', function () {
    it('should deal with child_process.exec', function (done) {
        const { exec } = require('child_process');
        const child = exec('node --version', (err) => {
            if (err) throw err;
        });

        child.on('close', () => {
            expect(actions).to.have.lengthOf(5);
            expect(actions[0]).to.deep.include({
                operation: [
                    'async function call',
                    'function returning an async object'
                ],
                object: 'child_process',
                function: 'exec',
                ID: 1
            });
            expect(actions[1]).to.deep.include({
                operation: ['async function call'],
                object: 'ChildProcess',
                function: 'on',
                ID: 2
            });
            expect(actions[3]).to.deep.include({
                operation: 'callback run',
                registeredBy: 1
            });
            expect(actions[4]).to.deep.include({
                operation: 'callback run',
                registeredBy: 2
            });
            done();
        });
    });

    it('should deal with net.connect', function (done) {
        const net = require('net');
        const server = net.createServer();
        server.listen(8080, function () {
            const socket1 = net.connect({ port: 8080 }, () => {
                socket1.end();
                server.close();
            });
        });
        server.on('close', () => {
            expect(actions).to.have.lengthOf(12);
            expect(actions[4]).to.deep.include({
                operation: [
                    'async function call',
                    'function returning an async object'
                ],
                object: 'net',
                function: 'connect',
                ID: 4
            });
            expect(actions[5]).to.deep.include({
                operation: 'callback run',
                registeredBy: 4
            });
            expect(actions[6]).to.deep.include({
                operation: [
                    'async function call',
                ],
                object: 'net.Socket',
                function: 'end',
                ID: 5
            });
            done();
        });
    });
});

describe('Combining oc, ro, cb, and co: nacd', function () {
    it('should deal with net.Server (with new)', function (done) {
        const net = require('net');
        // WITH new here
        const server = new net.Server(function (conn) {
            conn.on('error', () => { });
        });

        server.listen(8080, function () {
            const socket1 = net.Socket();
            socket1.connect({ port: 8080 }, () => {
                socket1.end();
                server.close();
            });
        });
        server.on('close', () => {
            expect(actions).to.have.lengthOf(16);
            expect(actions[0]).to.deep.include({
                operation: [
                    'constructor returning an async object',
                    'with callback object(s)'
                ],
                object: 'net',
                function: 'Server',
                ID: 1
            });
            expect(actions[1]).to.deep.include({
                operation: ['async function call'],
                object: 'net.Server',
                function: 'listen'
            });
            expect(actions[2]).to.deep.include({
                operation: ['async function call'],
                object: 'net.Server',
                function: 'on',
                argument: 'close'
            });
            expect(actions[7]).to.deep.include({
                operation: ['async function call'],
                object: 'net.Socket',
                function: 'on',
                argument: 'error'
            });
            expect(actions[10]).to.deep.include({
                operation: ['async function call'],
                object: 'net.Server',
                function: 'close'
            });
            done();
        });
    });

    it('should deal with net.Server (no new)', function (done) {
        const net = require('net');
        // NO new here
        const server = net.Server(function (conn) {
            conn.on('error', () => { });
        });

        server.listen(8080, function () {
            const socket1 = net.Socket();
            socket1.connect({ port: 8080 }, () => {
                socket1.end();
                server.close();
            });
        });
        server.on('close', () => {
            expect(actions[0]).to.deep.include({
                operation: [
                    'async function call',
                    'function returning an async object',
                    'with callback object(s)'
                ],
                object: 'net',
                function: 'Server',
                ID: 1
            });
            expect(actions[1]).to.deep.include({
                operation: ['async function call'],
                object: 'net.Server',
                function: 'listen'
            });
            expect(actions[2]).to.deep.include({
                operation: ['async function call'],
                object: 'net.Server',
                function: 'on',
                argument: 'close'
            });
            expect(actions[7]).to.deep.include({
                operation: ['async function call'],
                object: 'net.Socket',
                function: 'on',
                argument: 'error'
            });
            expect(actions[10]).to.deep.include({
                operation: ['async function call'],
                object: 'net.Server',
                function: 'close'
            });
            done();
        });
    });

    it('should deal with http.Server (with new)', function (done) {
        const http = require('http');
        //WITH new
        const server = new http.Server((req, res) => {
            req.on('error', () => { });
            res.write('hi', () => { });
            res.end(() => { });
        });
        server.listen(8080, () => {
            http.get('http://localhost:8080').on('close', () => {
                server.close();
                expect(actions[0]).to.deep.include({
                    operation: [
                        'constructor returning an async object',
                        'with callback object(s)'
                    ],
                    object: 'http',
                    function: 'Server',
                    ID: 1
                });
                expect(actions[1]).to.deep.include({
                    operation: ['async function call'],
                    object: 'http.Server',
                    function: 'listen'
                });
                expect(actions[5]).to.deep.include({
                    operation: 'callback run',
                    registeredBy: 1
                });
                expect(actions[6]).to.deep.include({
                    operation: ['async function call'],
                    object: 'http.IncomingMessage',
                    function: 'on',
                    argument: 'error'
                });
                expect(actions[7]).to.deep.include({
                    operation: ['async function call'],
                    object: 'http.ServerResponse',
                    function: 'write',
                    ID: 6
                });
                expect(actions[8]).to.deep.include({
                    operation: ['async function call'],
                    object: 'http.ServerResponse',
                    function: 'end',
                    ID: 7
                });
                done();
            });
        });
    });

    it('should deal with http.Server (no new)', function (done) {
        const http = require('http');
        //NO new
        const server = http.Server((req, res) => {
            req.on('error', () => { });
            res.write('hi', () => { });
            res.end(() => { });
        });
        server.listen(8080, () => {
            http.get('http://localhost:8080').on('close', () => {
                server.close();
                expect(actions[0]).to.deep.include({
                    operation: [
                        'async function call',
                        'function returning an async object',
                        'with callback object(s)'
                    ],
                    object: 'http',
                    function: 'Server',
                    ID: 1
                });
                expect(actions[1]).to.deep.include({
                    operation: ['async function call'],
                    object: 'http.Server',
                    function: 'listen'
                });
                expect(actions[5]).to.deep.include({
                    operation: 'callback run',
                    registeredBy: 1
                });
                expect(actions[6]).to.deep.include({
                    operation: ['async function call'],
                    object: 'http.IncomingMessage',
                    function: 'on',
                    argument: 'error'
                });
                expect(actions[7]).to.deep.include({
                    operation: ['async function call'],
                    object: 'http.ServerResponse',
                    function: 'write',
                    ID: 6
                });
                expect(actions[8]).to.deep.include({
                    operation: ['async function call'],
                    object: 'http.ServerResponse',
                    function: 'end',
                    ID: 7
                });
                done();
            });
        });
    });    
});