const expect = require('chai').expect;
const benchs = require('../benchmarks/noderacer-benchmarks-3');
const runTest = require('./runtest');

const bench = (name) => benchs.find(b => b.name === name);
const IT = 1;
const RUNS = 10; 

console.warn('These tests may take a while...');

describe('Benchmarks 3', function () {
    this.timeout(50000 * 20);

    it('ME1', function () {
        const benchmark = bench('ME1');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('ME2', function () {
        const benchmark = bench('ME2');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('ME3', function () {
        const benchmark = bench('ME3');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('ME4', function () {
        const benchmark = bench('ME4');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('NEDB1', function () {
        const benchmark = bench('NEDB1');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('NEDB2', function () {
        const benchmark = bench('NEDB2');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('ARC', function () {
        const benchmark = bench('ARC');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('OBJ', function () {
        const benchmark = bench('OBJ');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: false })[0];
        expect(out[4]).to.be.eql(0); // this is not supposed to show a bug (false positive for noderacer)
    });

});