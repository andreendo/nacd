**Benchmark express-user:** The original script (server-test.js) presents a flaky behavior that is detected by NACD (but not by NodeRacer), besides the original race bug. As we aimed to the original event race, we fixed the script to remove this flaky behavior identified by NACD: move the setTimeout to the callback after starting server, to avoid send a request before the server is up-and-running.  

```
- app.listen(port); // line 12 of server-test.js

+ app.listen(port, () => { 
+    // add the setTimeout in line 16 here 
+ });
```

We rerun the NACD and NodeRacer with this change, now using the new entry test is 'server-test-no-flaky.js', to collect the results. 

**Benchmark live-server:** In NodeRacer, its instrumentation is set up for the following files:
```
        "**/*.js",
        "!**/node_modules/**",
        "**/node_modules/live-server/**",
        "**/node_modules/chokidar/**",
        "**/node_modules/send/**",
        "!**/modify.js"
```

So, we also restricted the delays for core modules related to targeted library chokidar, which are "fs" and "zlib". In [lib/mode/config.js](../../lib/mode/config.js), set this.restrictModulesInst to "true" and add to this.restrictedModules ['fs', 'zlib'] to restrict modules with delays. In the entry script 'race-root-dir-test.js', we added a catch for promise rejection to avoid the script be stuck for too long.


**Benchmark xlsx:** In this benchmark, we have the following failure using NodeRacer, and NACD could not consistently reproduce this bug.   
```
1) xlsx
       extract
         should read all columns and rows:

      Uncaught AssertionError [ERR_ASSERTION]: invalid row count
      + expected - actual

      -0
      +13
      
      at XLSX.<anonymous> (test/tests.js:81:13)
      at /home/user/benchmarks/noderacer/known-bugs/xlsx-extract/lib/xlsx-extract.js:965:10
      at /home/user/benchmarks/noderacer/known-bugs/xlsx-extract/lib/xlsx-extract.js:925:4
      at Parse.__NR_ANONYMOUS (lib/xlsx-extract.js:827:5)
      at Parse.<anonymous> (lib/xlsx-extract.js:845:51)
      at Parse._flush (node_modules/unzip2/lib/parse.js:319:8)
```

We investigated the source code of xlsx-extract. The project imports 3 libs that may contain async behavior, fs, node-expat, and unzip2. As fs (directly) and unzip2 (undirectly by zlib) are covered by NACD, we investigated node-expat. We noticed that unzip2 generates an event emitter from a fileStream (where NACD can inject delays). Nevertheless, the entry emitted by event ".on('entry')"(line 677 of xlsx-extract.js) is a stream which NACD cannot manipulate. Our workaround is to model node-expat as an event emmitter. For this setup, NACD is capable of reproduce the error with 100% bug reproduction ratio.  

NACD inserts delays to the fileReadStream (_read function), which propagates to the following piped object from the unzip lib. However, this library can divide the zip files in entries and forward them as streams. As the entries are delineated and forwarded, the stream is not more related to the original fileReadStream. We can say that unzip library controls the async behavior coming from the stream and make the NACD behaves like vanilla node.js afterwards. So, NACD cannot detect the race as it behaves like vanilla node.