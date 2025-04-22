const { join } = require('path');
const { expect } = require('chai');
const parseTestOutput = require('../../lib/tools/parsetestoutput');

const file = name => join('test/resources/test_outputs_samples/', name);

describe('TestOutputParser', () => {
    it('should deal with Mocha output 1', () => {
        expect(parseTestOutput(file('mocha-style-01.txt')))
            .to.eql({ pass: 76, fail: 18 });
    });

    it('should deal with Mocha output 2', () => {
        expect(parseTestOutput(file('mocha-style-02.txt')))
            .to.eql({ pass: 97, fail: 0 });
    });

    it('should deal with Mocha output 3', () => {
        expect(parseTestOutput(file('mocha-style-03.txt')))
            .to.eql({ pass: 37, fail: 0 });
    });

    it('should deal with Mocha output 4', () => {
        expect(parseTestOutput(file('mocha-style-04.txt')))
            .to.eql({ pass: 0, fail: 4 });
    });

    it('should deal with Jest output 1', () => {
        expect(parseTestOutput(file('jest-style-01.txt')))
            .to.eql({ pass: 10761, fail: 240 });
    });

    it('should deal with Jest output 2', () => {
        expect(parseTestOutput(file('jest-style-02.txt')))
            .to.eql({ pass: 76, fail: 0 });
    });

    it('should deal with Ava output 1', () => {
        expect(parseTestOutput(file('ava-style-01.txt')))
            .to.eql({ pass: 0, fail: 2 });
    });

    it('should deal with Ava output 2', () => {
        expect(parseTestOutput(file('ava-style-02.txt')))
            .to.eql({ pass: 0, fail: 7 });
    });

    it('should deal with Ava output 3', () => {
        expect(parseTestOutput(file('ava-style-03.txt')))
            .to.eql({ pass: 96, fail: 0 });
    });

    it('should deal with Ava output 4', () => {
        expect(parseTestOutput(file('ava-style-04.txt')))
            .to.eql({ pass: 59, fail: 0 });
    });

    it('should deal with Tape output 1', () => {
        expect(parseTestOutput(file('tape-style-01.txt')))
            .to.eql({ pass: 281, fail: 0 });
    });

    it('should deal with Tape output 2', () => {
        expect(parseTestOutput(file('tape-style-02.txt')))
            .to.eql({ pass: 637, fail: 4 });
    });    

    it('should deal with Tap output 1', () => {
        expect(parseTestOutput(file('tap-style-01.txt')))
            .to.eql({ pass: 14, fail: 18 + 60 });
    });

    it('should deal with Tap output 2', () => {
        expect(parseTestOutput(file('tap-style-02.txt')))
            .to.eql({ pass: 14, fail: 26 + 60 });
    });

    it('should deal with Jasmine output 1', () => {
        expect(parseTestOutput(file('jasmine-style-01.txt')))
            .to.eql({ pass: 147, fail: 0 });
    });
    
    it('should deal with Jasmine output 2', () => {
        expect(parseTestOutput(file('jasmine-style-02.txt')))
            .to.eql({ pass: 147, fail: 5 });
    });    
});