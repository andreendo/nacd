const expect = require('chai').expect;
const benchs = require('../benchmarks/noderacer-benchmarks-2');
const runTest = require('./runtest');

const bench = (name) => benchs.find(b => b.name === name);
const IT = 1;
const RUNS = 10; 

console.warn('These tests may take a while...');

describe('Benchmarks 2', function () {
    this.timeout(50000 * 20);

    it('BB1', function () {
        const benchmark = bench('BB1');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: false })[0];
        expect(out[4]).to.be.eql(0); 
    });

    it('EXP', function () {
        const benchmark = bench('EXP');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: false })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });    

    it('GPT', function () {
        const benchmark = bench('GPT');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: false })[0];
        console.log(out);
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('LVS', function () {
        const benchmark = bench('LVS');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: false })[0];
        console.log(out);
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('SIOC', function () {
        const benchmark = bench('SIOC');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: false })[0];
        console.log(out);
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });
});