const shell = require('shelljs');

module.exports = function runTest(benchmark, opts) {
        return runTool({ ...benchmark, ...opts, mode: 'nacd-plain2' });
}

function runTool(args) {
    args.preCommand = args.preCommand || '';
    if (args.silent === undefined) args.silent = true;

    shell.cd(`${args.folder}`);
    const ret = [];
    for (let i = 1; i <= args.iterations; i++) {
        const out = runIteration(i, args);
        ret.push({ iteration: i, out });
    }

    return ret;
}

function runIteration(iteration, args) {
    shell.rm('-R', 'logs');
    let output = [];
    output.push(iteration, args.runs, args.mode, args.name);
    let numberOfFails = 0;
    let firstFail = 0;
    for (let i = 1; i <= args.runs; i++) {
        let execOut = shell.exec(`${args.preCommand} nacd plain2 ${args.command}`, { silent: args.silent });
        if (execOut.stdout.includes(args.errorMessage) || execOut.code === 124) {
            numberOfFails++;
            if (firstFail === 0)
                firstFail = i;
        }
        shell.exec(`sleep 0.5`);
    }
    output.push(numberOfFails, firstFail);
    return output;
}