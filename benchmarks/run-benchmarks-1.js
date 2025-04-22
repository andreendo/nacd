const benchmarks = require('./noderacer-benchmarks');
const runTest = require('./runtest');

console.log('iteration,runs,tool,benchmark,fails,firstfail');
runTest(benchmarks, { iterations: 30, runs: 100, silent: true });

// The next lines used in RQ3
// benchmarks2 = benchmarks.filter(b => b.name == "XLS");
// runTest(benchmarks2, { iterations: 1, runs: 100, silent: true });