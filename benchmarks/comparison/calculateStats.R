calculateStats <- function(tool, data) {
    cat('Tool,Benchmark,Median,MAD,Max,Min\n')
    
    benchmarks <- unique(data$benchmark)
    
    for ( c_bench in benchmarks ) {
        dataPerBenchmark <- data[which(data$benchmark == c_bench),]
        bugRepRatio <- dataPerBenchmark$fails/100
        median(bugRepRatio)
        mad(bugRepRatio)
        cat(paste(c(tool, c_bench, median(bugRepRatio), mad(bugRepRatio), max(bugRepRatio), min(bugRepRatio)), collapse = ","), '\n')
    }
}

cat('------------------------------------\n')
cat('NodeFz results\n')
cat('--------------\n')
calculateStats( "Node.fz", read.csv(file="nodefz-results.csv", header=TRUE, sep=",") )
cat('------------------------------------\n')

cat('------------------------------------\n')
cat('NodeRacer results\n')
cat('--------------\n')
calculateStats( "NodeRacer", read.csv(file="noderacer-results.csv", header=TRUE, sep=",") )
cat('------------------------------------\n')

cat('------------------------------------\n')
cat('NACD results\n')
cat('--------------\n')
calculateStats( "NACD", read.csv(file="nacd-results.csv", header=TRUE, sep=",") )
cat('------------------------------------\n')