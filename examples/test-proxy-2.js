// const StackTracey = require('stacktracey');

let a = {
    foo: function () {
        console.log('foo');
    },
    bar: function () {
        console.log('bar');
    },
    c: 10
}

a = new Proxy(a, {
    get: function (target, property, receiver) {
        console.log(`get ${property}`);
        let value = Reflect.get(target, property, receiver);
        if (typeof value === 'function') {
            return new Proxy(value, {
                apply: function (target, thisArg, argumentsList) {
                    console.log(`apply ${property}`);
                    // let stack = new StackTracey();
                    // console.log(stack);
                    return Reflect.apply(target, thisArg, argumentsList);
                }
            });
        }
        return value;
    }
});

a.foo();
a.bar();
a.c;