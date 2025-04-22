const path = require('path');
const StackTracey = require('stacktracey');

function collectCurrentStackTrace() {
    Error.stackTraceLimit = Infinity;
    let error = new Error();
    return error.stack;
}

function isFromOutsideModules(stack) {
    console.log('------------');
    console.log(new StackTracey(stack)[2].file);
    console.log('folder:', path.dirname(new StackTracey(stack)[2].file));
    const dirname = path.dirname(new StackTracey(stack)[2].file).trim();
    console.log('out:', (dirname === '' || dirname === '.'));
    console.log('------------');

    return (dirname === '' || dirname === '.');
}

function isCalledFromInternalModules(stack) {
    // first 2 elements are nacd related (ignored)
    const dirname = path.dirname(new StackTracey(stack)[2].file).trim();
    return dirname === '' || dirname === '.' || dirname.startsWith('internal');
}

module.exports = { collectCurrentStackTrace, isFromOutsideModules, isCalledFromInternalModules };