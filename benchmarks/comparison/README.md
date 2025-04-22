# RQ1 - Bug reproduction ratio and RQ2 - Number of Runs Until First Failure

Individual results are available in the following files:
- Node.fz: [\<click here to see the CSV file\>](nodefz-results.csv)
- NodeRacer: [\<click here to see the CSV file\>](noderacer-results.csv)
- NACD: [\<click here to see the CSV file\>](nacd-results.csv) 

We provide the following files used to make the analyses:
- File ['rq1-all-results.csv'](rq1-all-results.csv): it summarizes all pieces of data used to answer RQ1 and RQ2. 
- File ['bug-reproduction-ratio.csv'](bug-reproduction-ratio.csv): it contains the median, min, max, and MAD for bug reproduction ratio used in RQ1. 
- File ['calculateStats.R'](calculateStats.R): an R script that computes the stats in the previous file. 
```bash
    Rscript calculateStats.R
```
- File ['calculate-graphs.R'](calculate-graphs.R): an R script that generates the graphs used in the paper. 
```bash
    Rscript calculate-graphs.R
``` 

## Running the benchmarks

Some benchmarks depend on external systems to run correctly. To do so, start the Docker containers using the instructions available [here](../docker/README.md).

To collect data related to NodeRacer and Node.fz, we reused and adapted the scripts provided by the NodeRacer study. 

In the **NodeRacer project you downloaded and unzipped**, perform the following steps:

- update the benchmarks path in tests/experiments/benchmark_config.js

### Node.Fz
To generate the CSV file related to Node.fz, run the following scripts:

```bash
    node tests/experiments/known-bugs/start-nodefz.js
    node tests/experiments/open-issues/nodefz-bluebird-issue-1446.js
```

### NodeRacer

To generate the CSV file related to NodeRacer, run the following script:
```bash
    node tests/experiments/known-bugs/start-noderacer.js
```

This will generate the data for the first 11 benchmarks in the paper. 

For the next 5 benchmarks related to open issues in NodeRacer paper, run:

```bash
    node tests/experiments/open-issues/get-port-issue-23.js
```

For the live-server benchmark, run: 
```bash
    node tests/experiments/open-issues/live-server-issue-262.js
```

In the live-server benchmark, we needed to fix the entry file in line 21, due to a specific setup to run it in our machine. We documented the change next:

`
const browser = await puppeteer.launch({
        args: ["--disable-gpu", '--no-sandbox',  '--disable-setuid-sandbox']
});

`
For the bluebird and socket-io-client benchmarks, run:
```bash
    node tests/experiments/open-issues/bluebird-issue-1446.js
    node tests/experiments/open-issues/socket-io-3358.js
```

For the express benchmark, run: 
```bash
    node tests/experiments/open-issues/express-issue-3536.js
```

In the express benchmark, you need to run first in the benchmark folder, node express01/testdb.js to populate the mongoDB. 
 

For the 8 benchmarks related to the exploratory part in NodeRacer paper, run:
```bash
    node tests/experiments/exploratory/failing-tests/mongo-express-exp.js
    node tests/experiments/exploratory/failing-tests/nedb-arc-obj-exp.js
```

We included the previous 2 scripts to ease the data collection and fix minor issues to setup Mocha. 


### NACD

Back to **this NACD project**, run the following scripts: 
```bash
    node benchmarks/run-benchmarks-1.js
    node benchmarks/run-benchmarks-2.js
    node benchmarks/run-benchmarks-3.js 
```

This generates CSV files for the 24 benchmarks. 

Specific observations for some benchmarks are described [\<here\>](Benchs-README.md). 