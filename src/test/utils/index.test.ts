import { randomUsername } from '../../utils';
import assert from 'assert';

describe('Utils test', async function () {
    describe('Generate random name', function () {
        it('Conflicts should be lower than 0.01%', function () {
            const names = new Set();
            const testSample = 2 << 20;
            let conflicts = 0;
            for (let i = 0; i < testSample; i++) {
                const name = randomUsername();
                if (names.has(name)) {
                    conflicts++;
                }
                names.add(name);
            }
            assert.equal(conflicts * 10000 < testSample, true);
        });
    });
});
