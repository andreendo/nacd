const expect = require('chai').expect;
const benchs = require('../benchmarks/noderacer-benchmarks');
const runTest = require('./runtest');

const bench = (name) => benchs.find(b => b.name === name);
const IT = 1;
const RUNS = 10; 

console.warn('These tests may take a while...');

describe('Benchmarks 1', function () {
    this.timeout(50000 * 20);

    it('AKA', function () {
        const benchmark = bench('AKA');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('FPS', function () {
        const benchmark = bench('FPS');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('GHO', function () {
        const benchmark = bench('GHO');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('MKD', function () {
        const benchmark = bench('MKD');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('NES', function () {
        const benchmark = bench('NES');
        const { out } = runTest(benchmark, { iterations: IT, runs: 100, silent: false })[0];
        console.log(out);
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('NLF', function () {
        const benchmark = bench('NLF');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('SIO', function () {
        const benchmark = bench('SIO');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('DEL', function () {
        const benchmark = bench('DEL');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('LST', function () {
        const benchmark = bench('LST');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('NSC', function () {
        const benchmark = bench('NSC');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: false })[0];
        expect(out[4] / 10).to.be.greaterThan(benchmark.nacdMinimumBugReproRatio);
    });

    it('XLS', function () {
        const benchmark = bench('XLS');
        const { out } = runTest(benchmark, { iterations: IT, runs: RUNS, silent: true })[0];        
        expect(out[4]).to.be.eql(0); // we did not expect to reveal this race bug
    });
});