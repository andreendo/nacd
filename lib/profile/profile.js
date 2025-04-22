const { createLogFolder, DataBase } = require('../util');
const ProfilePatcher = require('./profilepatcher');

module.exports = function installProfile(command) {
    new ProfilePatcher(new DataBase(createLogFolder(command), 'profile'))
        .installProxyForGlobalFunctions()
        .installProxyForGlobalObjects()
        .installProxyForRequire()
        .startRecordingLog();
}