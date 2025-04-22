const installProfile = require('./profile');
const sw = require('spawn-wrap');

installProfile(process.env.command);
sw.runMain();