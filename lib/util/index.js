const fse = require('fs-extra');
const path = require('path');
const random = require('random');
const builtinModules = require('./builtin-modules');
const asyncModules = require('./async-modules');
const globalFunctions = require('./global-functions');
const DataBase = require('./database');
const {
    collectCurrentStackTrace,
    isFromOutsideModules,
    isCalledFromInternalModules 
} = require('./stacktrace');
const { isSync, isSyncWithoutCallback } = require('./sync-functions');

function createLogFolder(command) {
    const logFolder = path.join(process.cwd(), 'logs', sanitize(command));
    try {
        fse.ensureDirSync(logFolder);
    } catch(err) {
        // exception may be launched when the process has not permission to create the folder
        console.log(err); 
    }
    
    return logFolder;
}

function sanitize(str) {
    str = str.replace(/,/g, '__');
    str = str.replace(/\//g, '_');
    str = str.replace(/\./g, '_');
    return str;
}

function randomBoolean() {
    return random.boolean();
    // return false;
}

function randomUpTo(max) {
    return random.int(0, max);
}

module.exports = {
    builtinModules,
    asyncModules,
    globalFunctions,
    createLogFolder,
    DataBase,
    collectCurrentStackTrace,
    isFromOutsideModules,
    isCalledFromInternalModules,
    randomBoolean,
    randomUpTo,
    isSync,
    isSyncWithoutCallback
};