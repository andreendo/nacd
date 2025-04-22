## Motivating example used in the paper 

Using nacd, we detected a flaky test in npm package fs-extra (https://www.npmjs.com/package/fs-extra).
We reported it and submitted a pull request that has been merged in the repo (see https://github.com/jprichardson/node-fs-extra/pull/736); to do so, we used an anonymous GitHub account.

The project version we used can be downloaded from https://drive.google.com/file/d/1FvpTKG49T3hyRmU6_JplVSXn-B9qUP51/view?usp=sharing

To reproduce the race bug, perform the following steps:

- Unzip the downloaded file
- Go to the root dir of the project 
- To run the test:
```bash
    ./node_modules/.bin/mocha --timeout=10000 -f 'without a callback' lib/remove/__tests__/remove.test.js
```

- To run the test with nacd (a couple of runs may be required):
```bash
    nacd plain2 ./node_modules/.bin/mocha --timeout=10000 -f 'without a callback' lib/remove/__tests__/remove.test.js
```

For the failing runs, the following error message is shown: 

```
remove
    + remove()
      ✓ should delete without a callback (414ms)
      1) should delete without a callback


  1 passing (1s)
  1 failing

  1) remove
       + remove()
         should delete without a callback:
     Error: done() called multiple times
      at fse.pathExists (lib/remove/__tests__/remove.test.js:78:13)
      at fn.apply.then.r (node_modules/universalify/index.js:23:46)
```

Check Section 2 of the paper for further explanations. 