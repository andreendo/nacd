const { collectCurrentStackTrace } = require('../lib/util');

function foo() {
    console.log(collectCurrentStackTrace());
}

function bar() {
    foo();
}

(function () {
    bar();
})();
