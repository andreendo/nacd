const foo = {}

foo.bar = function(b) {
    console.log('bar', b);
}

foo.bar = new Proxy(foo.bar, {
    apply(target, thisArg, argsList) {
        console.log('proxy');
        return Reflect.apply(target, thisArg, argsList);
    }
})

foo.bar.apply(foo, [10]);