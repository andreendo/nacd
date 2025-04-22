// const StackTracey = require('stacktracey');
const fse = require('fs-extra');
const glob = require('glob');
const StackUtils = require('stack-utils');
const stackUtils = new StackUtils({ cwd: '/home/user/benchmarks/nacd', internals: StackUtils.nodeInternals() });

function getCallerPackage(stackStr) {
    const lines = stackUtils
        .clean(stackStr)
        .split('\n')
        .map(l => stackUtils.parseLine(l))
        .filter(l => l != null)
        .filter(l => !l.file.includes('nacd/lib/util/'))
        .filter(l => !l.file.includes('nacd/lib/mode/plain2/'));

    if (lines.length === 0)
        return '';

    return lines[0].file;
}

function checkFile(filePath) {
    const entries = fse.readJSONSync(filePath)
        .filter(entry => Array.isArray(entry.operation));
    const ret = new Set();
    entries.forEach(e => {
        ret.add(getCallerPackage(e.stackTrace));
    });        
    console.log(ret);
}

// const projectPath = '/home/user/benchmarks/nacd/sindresorhus_superheroes/logs';
const projectPath = '/home/user/benchmarks/nacd/sindresorhus_supervillains/logs';
// const projectPath = '/home/user/benchmarks/nacd/archiverjs_node-archiver/logs';

glob.sync(projectPath + '/*/*.json').forEach(checkFile);