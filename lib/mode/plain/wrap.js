const { createLogFolder, DataBase } = require('../../util');
const PlainMode = require('./plainmode');
const sw = require('spawn-wrap');

new PlainMode(new DataBase(createLogFolder(process.env.command), 'plain'))
    .install()
    .startRecordingLog();

sw.runMain();