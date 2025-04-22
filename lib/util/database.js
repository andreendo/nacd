const path = require('path');
const fse = require('fs-extra');

class DataBase {
    constructor(logFolder, mode) {
        this.mydb = [];
        this.record = false;
        this.shouldLog = true;  // set false to have no log of operations
        this.LIMIT = 5000;
        this.fileCounter = 0;
        if (logFolder && mode) {
            this.file = path.join(logFolder, `nacd-${mode}-${process.hrtime()}`);
            process.on('SIGTERM', () => process.exit());
            process.on('exit', () => {
                this.dump();
            });
        }
    }

    put(obj) {
        if (!this.record) return;
        if (!this.shouldLog) return;
        this.mydb.push(obj);

        if (this.mydb.length === this.LIMIT) {
            this.dump();
        }
    }

    startRecording() {
        this.record = true;
    }

    dump() {
        this.fileCounter++;
        const jsonFileName = this.file + '--' + this.fileCounter + '.log.json';
        fse.writeJSONSync(jsonFileName, this.mydb, { spaces: 2 });
        this.mydb = [];
    }
}

module.exports = DataBase;