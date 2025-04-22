const { isProxy } = require('util').types;

function proxyEvalOutsideStrictMode(apply) {
    if (!isProxy(eval)) {
        eval = new Proxy(eval, { apply });
    }
}

module.exports = proxyEvalOutsideStrictMode;