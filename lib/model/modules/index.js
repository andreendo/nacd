const model = [];

model.push(...require('./event-emitter.json'));
model.push(...require('./stream.json'));

model.push(...require('./child_process.json'));
model.push(...require('./cluster.json'));
model.push(...require('./crypto.json'));
model.push(...require('./dgram.json'));
model.push(...require('./dns.json'));
model.push(...require('./fs.json'));
model.push(...require('./http.json'));
model.push(...require('./http2.json'));
model.push(...require('./https.json'));
model.push(...require('./net.json'));
model.push(...require('./process.json'));
model.push(...require('./readline.json'));
model.push(...require('./repl.json'));
model.push(...require('./tls.json'));
model.push(...require('./util.json'));
model.push(...require('./zlib.json'));

// add modelled modules outside core modules
// model.push(...require('./nodeexpat.json'));

module.exports = model;