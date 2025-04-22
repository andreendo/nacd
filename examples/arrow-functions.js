let foo = (a, b, c) => {
    console.log(a, b, c);
}

foo = new Proxy(foo, {
    apply(target, thisArg, argumentsList) {
        console.log('apply');

        argumentsList.forEach((arg) => {
            console.log(typeof arg);
        });

        console.log(argumentsList.filter((arg) => typeof(arg) === 'function'));

        return Reflect.apply(target, thisArg, argumentsList);
    }
});

foo(1, 2, () => {});