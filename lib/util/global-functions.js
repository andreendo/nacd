// List of global functions in Node.js

const compareVersions = require('compare-versions');

const globalFunctions = [
    // Function properties    
    { mod: 'global', func: 'isFinite' },
    { mod: 'global', func: 'isNaN' },
    { mod: 'global', func: 'parseFloat' },
    { mod: 'global', func: 'parseInt' },
    { mod: 'global', func: 'decodeURI' },
    { mod: 'global', func: 'decodeURIComponent' },
    { mod: 'global', func: 'encodeURI' },
    { mod: 'global', func: 'encodeURIComponent' },
    // it needs to be proxied at the end, outside strict mode
    // 'eval'
    { mod: 'global', func: 'escape' },
    { mod: 'global', func: 'unescape' },
    // Timers global API
    { mod: 'timers', func: 'setImmediate' },
    { mod: 'timers', func: 'setInterval' },
    { mod: 'timers', func: 'setTimeout' },
    { mod: 'timers', func: 'clearImmediate' },
    { mod: 'timers', func: 'clearInterval' },
    { mod: 'timers', func: 'clearTimeout' }
];

const currentNodeVersion = process.version.replace('v', '');
if (compareVersions(currentNodeVersion, '11.0.0') >= 0) {
    globalFunctions.push({ mod: 'global', func: 'queueMicrotask' });
}

module.exports = globalFunctions;