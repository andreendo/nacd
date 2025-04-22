const glob = require('glob');
const path = require('path');
const fse = require('fs-extra');
const graphviz = require('graphviz');
const StackTracey = require('stacktracey');
const { builtinModules } = require('../util');

function profileReport() {
    console.log('Profile reporting..');
    glob.sync('./logs/*/').forEach((folder) => {
        const entries = [];
        glob.sync(path.join(folder, '*.log.json')).forEach((file) => {
            entries.push(...fse.readJSONSync(file));
        });

        buildRequireGraph(folder, entries);
        buildFunctionCallGraph(folder, entries);
    });
}

function buildFunctionCallGraph(folder, entries) {
    const g = graphviz.digraph("G");
    g.set('rankdir', 'LR');
    const map = new Map();
    const edges = new Map();
    map.set('application_code', g.addNode('application_code', { 'shape': 'Mdiamond' }));
    const { deps, devDeps } = loadDependencies();

    deps.forEach((dep) => {
        if (!map.has(dep)) {
            map.set(dep, g.addNode(dep));
        }
    });

    devDeps.forEach((dep) => {
        if (!map.has(dep)) {
            map.set(dep, g.addNode(dep, { 'color': 'lightgrey', 'style': 'filled' }));
        }
    });

    entries
        .filter((e) => e.operation === 'function call')
        .forEach((e) => {
            if (!map.has(e.module))
                map.set(e.module, g.addNode(e.module, { 'shape': 'box' }));

            const callers = getCallerModule(e.stackTrace);
            const caller = callers[0];
            if (!edges.has(`${caller}-${e.function}-${e.module}`)) {
                if (!map.has(caller)) {
                    map.set(caller, g.addNode(caller, { 'color': 'lightblue', 'style': 'filled' }));
                }

                g.addEdge(map.get(caller), map.get(e.module), { 'label': e.function });
                edges.set(`${caller}-${e.function}-${e.module}`, true);
            }

            for (let i = 0; i < callers.length - 1; i++) {
                // callers[i+1] -> callers[i]
                const caller = callers[i + 1];
                const callee = callers[i];
                if (!map.has(caller)) {
                    map.set(caller, g.addNode(caller, { 'color': 'lightblue', 'style': 'filled' }));
                }

                if (!edges.get(`${caller}-${callee}`)) {
                    g.addEdge(map.get(caller), map.get(callee));
                    edges.set(`${caller}-${callee}`, true)
                }
                    
            }

        });

    g.output('png', path.join(folder, 'function-call-graph.png'));
}

function buildRequireGraph(folder, entries) {
    const g = graphviz.digraph('G');
    g.set('rankdir', 'LR');
    const map = new Map();
    const edges = new Map();
    map.set('application_code', g.addNode('application_code', { 'shape': 'Mdiamond' }));
    const { deps, devDeps } = loadDependencies();

    deps.forEach((dep) => {
        if (!map.has(dep)) {
            map.set(dep, g.addNode(dep));
        }
    });

    devDeps.forEach((dep) => {
        if (!map.has(dep)) {
            map.set(dep, g.addNode(dep, { 'color': 'lightgrey', 'style': 'filled' }));
        }
    });

    entries
        .filter((e) => e.operation === 'require')
        .forEach((e) => {
            if (!map.has(e.module)) {
                if (builtinModules.includes(e.module))
                    map.set(e.module, g.addNode(e.module, { 'shape': 'box' }));
                else
                    map.set(e.module, g.addNode(e.module, { 'color': 'lightblue', 'style': 'filled' }));
            }
            const caller = getCallerModule(e.stackTrace)[0];
            if (!edges.has(caller + '->' + e.module)) {
                if (!map.has(caller)) {
                    map.set(caller, g.addNode(caller, { 'color': 'lightblue', 'style': 'filled' }));
                }

                g.addEdge(map.get(caller), map.get(e.module));
                edges.set(caller + '->' + e.module, true);
            }
        });

    g.output('png', path.join(folder, 'require-graph.png'));
}

function getCallerModule(stackTrace) {
    let stack = new StackTracey(stackTrace);
    stack = stack.filter((e) => e.file.indexOf('nacd/lib') === -1
        && e.file.indexOf('internal/modules/cjs') === -1);

    const moduleCallOrder = [];
    stack.forEach((e) => {
        let current;
        if (e.fileRelative.startsWith('node_modules'))
            current = e.fileRelative.split('/')[1];
        else
            current = 'application_code';

        if (!moduleCallOrder.includes(current))
            moduleCallOrder.push(current);
    });
    return moduleCallOrder;
    // let a = stack[0];
    // if (a.fileRelative.startsWith('node_modules')) {
    //     return a.fileRelative.split('/')[1];
    // }
    // return 'application_code';
}

function loadDependencies() {
    const deps = [];
    const devDeps = [];
    const { dependencies, devDependencies } = fse.readJSONSync('package.json');
    for (let dep in dependencies) deps.push(dep);

    for (let dep in devDependencies) devDeps.push(dep);

    return { deps, devDeps };
}

module.exports = profileReport;