const { createLogFolder, DataBase } = require('../../util');
const Plain2Mode = require('./plain2mode');
const sw = require('spawn-wrap');

const mode = new Plain2Mode(new DataBase(createLogFolder(process.env.command), process.env.mode));
switch(process.env.mode) {
    case 'never':
        mode.instrumenter.injector.active = false; 
        break;    
    case 'always':
        mode.instrumenter.injector.always = true;
        break;
}
require('events').EventEmitter.defaultMaxListeners = 0; // remove this warning
mode.install().startRecordingLog();
sw.runMain();