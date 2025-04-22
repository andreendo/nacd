let obj = {
    a: 1,
    b: 'an',
    foo: function () {
        console.log(this.a, this.b);
    }
}

obj.foo();

// --- instrument
for (let prop in obj) {
    if (typeof obj[prop] === 'function') {
        obj[prop] = new Proxy(obj[prop], {
            apply(target, thisArg, argsList) {
                return Reflect.apply(target, thisArg, argsList);
            }
        });
    }
}
// --- instrument

obj.foo();