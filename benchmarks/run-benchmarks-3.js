const benchmarks = require('./noderacer-benchmarks-3');
const runTest = require('./runtest');

console.log('iteration,runs,tool,benchmark,fails,firstfail');
runTest(benchmarks, { iterations: 30, runs: 100, silent: true });

// The next lines used in RQ3
// benchmarks2 = benchmarks.filter(b => b.name == "NEDB1");
// runTest(benchmarks2, { iterations: 1, runs: 100, silent: true });