// Module timers is excluded for now

module.exports = [
    'child_process',
    'cluster',
    'crypto',
    'dgram',
    'dns',
    'fs',
    'http',
    'http2',
    'https',
    'inspector',
    'net',
    'perf_hooks',
    'readline',
    'repl',
    // 'stream', // it seems that provide abstract interfaces (not real source of async tasks)
    'tls',
    'tty',
    'vm',
    'zlib'
];