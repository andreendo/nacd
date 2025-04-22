const { readFileSync } = require('fs');

const sumMatches = (str, regex, order = 0) => {
    const matches = str.match(regex) || [];
    return matches
        .map(elem => elem.match(/\d+/g)[order])
        .reduce((acc, elem) => acc + parseInt(elem), 0);
};

const parseTestOutput = filePath => {
    const fcontent = readFileSync(filePath, 'utf8');
    const res = {};
    // Mocha
    res.pass = sumMatches(fcontent, /\d+ passing/g);
    res.fail = sumMatches(fcontent, /\d+ failing/g);
    res.fail += sumMatches(fcontent, /\d+ of \d+ tests failed/g);
    // Jest
    res.pass += sumMatches(fcontent, /Tests:.+failed.+skipped.+\d+ passed/g, 2);
    res.pass += sumMatches(fcontent, /Tests:\s+\d+ passed.+\d+ total/g);
    res.fail += sumMatches(fcontent, /Tests:\s+\d+ failed/g);
    // Ava
    res.pass += sumMatches(fcontent, /  \d+ tests passed/g);
    res.pass += sumMatches(fcontent, /  \d+ passed\n/g);
    res.fail += sumMatches(fcontent, /  \d+ tests failed/g);
    // Tape
    res.pass += sumMatches(fcontent, /# pass\s+\d+/g);
    res.fail += sumMatches(fcontent, /# fail\s+\d+/g);
    // Tap
    res.fail += sumMatches(fcontent, /# failed \d+ of/g);
    // Jasmine
    res.pass += sumMatches(fcontent, /\d+ specs, \d+ failures/g);
    res.fail += sumMatches(fcontent, /\d+ specs, \d+ failures/g, 1);

    return res;
}

module.exports = parseTestOutput;