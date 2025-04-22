// Built-in modules with async operations may have synchronous functions.
// These functions maps them (on demand)
// assume async behavior for unknown cases

const syncFunctions = {
    tty: ['isatty']
};

const syncFunctionsNoCallback = {
    crypto: ['randomBytes']
};

const modulesWithSyncVersions = ['fs', 'crypto'];

function isSync(moduleName, functionName) {
    if (modulesWithSyncVersions.includes(moduleName) &&
        functionName.endsWith('Sync')) {
        return true;
    }

    if (syncFunctions[moduleName] &&
        syncFunctions[moduleName].includes(functionName)) {
        return true;
    }

    return false;
}

function isSyncWithoutCallback(moduleName, functionName) {
    if (syncFunctionsNoCallback[moduleName] &&
        syncFunctionsNoCallback[moduleName].includes(functionName)) {
        return true;
    }

    return false;
}

module.exports = { isSync, isSyncWithoutCallback };