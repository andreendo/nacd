const fs = require("fs");

const parseTimeOutput = (lines) => {
    const result = {};

    lines.forEach(line => {
        const match = line.match(/(real|user|sys)\s+((\d+)h)?(\d+)m(\d+,\d+)s/);
        if (match) {
            const key = match[1]; // Extract the label (real, user, sys)
            const hours = parseInt(match[3] || '0', 10); // Default to 0 if hours are not present
            const minutes = parseInt(match[4], 10); // Convert minutes to an integer
            const ms = parseInt(match[5].replace(',', '')); // 
            const milliseconds = (hours * 3600 + minutes * 60) * 1000 + ms; // Convert total time to ms
            result[key] = milliseconds;
        }
    });

    return result;
};

console.log("Tool,Benchmark,gnu_time_real,gnu_time_user,gnu_time_sys,Elapsed_time,CPU_time");

const tool = "NACD";
const file = "nacd.txt";

const lines = fs.readFileSync(file, "utf-8").split("\n");

for (let i = 0; (i+3) < lines.length; i+=4) {
    const toPrint = [];
    toPrint.push(tool)
    const benchmark = lines[i];
    toPrint.push(benchmark);
    const data = parseTimeOutput([lines[i+1], lines[i+2], lines[i+3]]);
    toPrint.push(data["real"])
    toPrint.push(data["user"])
    toPrint.push(data["sys"])
    toPrint.push(data["real"])
    toPrint.push(data["user"] + data["sys"])
    console.log(toPrint.join(","));
}
