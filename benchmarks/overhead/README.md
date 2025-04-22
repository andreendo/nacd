## Instructions for RQ3 - Overhead

To collect overhead, we adopted GNU Time. To do so, we add prefix command "time" for the scripts that run the benchmarks (see RQ1 to identify the scripts). We set up the scripts to run one benchmark at the time, with 100 repetitions.  

The time outputs for each tool are available in the following files:
- vanilla-nodejs.txt
- nodefz.txt
- noderacer.txt
- nacd.txt

Editing file [parser-data.js](parser-data.js), it is possible to generate the CSV files from the previous ones. After editing, run:
```bash
    node parser-data.js
```

File '[overhead-raw-data.csv](overhead-raw-data.csv)' is a summary of previous post-processed log files:

- Output "real" is used to indicate wall clock runtime, we refer to as 'Elapsed_time'. 
- The sum of outputs "user" and "sys" is used to indicate the actual processing time of the CPUs, we refer to as 'CPU_time'.  

We generate the following files to better process data and generate graphs for the paper. 

- File [rq3-overhead.csv](rq3-overhead.csv) contains the following columns:
    - Tool
    - Benchmark 
    - Bug_reproduction_ratio: bug reproduction ratio collected in RQ1
    - Elapsed_time_vanilla: elapsed time of running the benchmark using vanilla Node.js (v.10)
    - CPU_time_vanilla: CPU time of running the benchmark using vanilla Node.js (v.10)
    - Elapsed_time
    - CPU_time 
    - Elapsed_time_overhead: Elapsed_time / Elapsed_time_vanilla
    - CPU_time_overhead: CPU_time / CPU_time_vanilla

- File [rq3.R](rq3.R) contains the R script for the analyses and graphs used in the paper. 

