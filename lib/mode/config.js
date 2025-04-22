class Config {
    constructor() {
        // Set to 'true' if you want to restrict the modules instrumented, and
        this.restrictModulesInst = false;
        // list them next as strings
        this.restrictedModules = ['fs', 'node-expat'];
    }
}

module.exports = Config;