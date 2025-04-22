const expect = require('chai').expect;
const { prepare, readActionsFromLogFile, exec } = require('./helper');

describe('Delayed registration: nacd', function () {
    this.timeout(20000);

    beforeEach(prepare);

    it('should deal fs.read and fs.write', function () {
        exec(`nacd always node test/resources/delayed_reg_1.js`);
        const actions = readActionsFromLogFile();
        expect(actions).to.have.lengthOf(9);
        expect(actions[0]).to.deep.include({ function: 'readFile' });
        expect(actions[1]).to.deep.include({ function: 'writeFile' });
        expect(actions[2]).to.deep.include({ function: 'readFile' });
        expect(actions.filter(_ => _.operation === 'callback run'))
            .to.have.lengthOf(3);
        expect(actions.filter(_ => _.operation === 'run delayed registration'))
            .to.have.lengthOf(3);
    });

    it('should deal fs.read and fs.append', function () {
        exec(`nacd always node test/resources/delayed_reg_2.js`);
        const actions = readActionsFromLogFile();
        expect(actions).to.have.lengthOf(9);
        expect(actions[0]).to.deep.include({ function: 'appendFile' });
        expect(actions[1]).to.deep.include({ function: 'appendFile' });
        expect(actions[2]).to.deep.include({ function: 'readFile' });
        expect(actions.filter(_ => _.operation === 'callback run'))
            .to.have.lengthOf(3);
        expect(actions.filter(_ => _.operation === 'run delayed registration'))
            .to.have.lengthOf(3);
    });

    it('should deal fs.promises', function () {
        exec(`nacd always node test/resources/delayed_reg_2.js`);
        const actions = readActionsFromLogFile();
        expect(actions).to.have.lengthOf(9);
        expect(actions[0]).to.deep.include({ function: 'appendFile' });
        expect(actions[1]).to.deep.include({ function: 'appendFile' });
        expect(actions[2]).to.deep.include({ function: 'readFile' });
        expect(actions.filter(_ => _.operation === 'callback run'))
            .to.have.lengthOf(3);
        expect(actions.filter(_ => _.operation === 'run delayed registration'))
            .to.have.lengthOf(3);
    });
});