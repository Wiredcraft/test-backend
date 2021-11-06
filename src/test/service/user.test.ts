import assert from "assert";
import { config } from "../../config";
import { App } from "../../entry/app";
import { randomUsername } from "../../utils";

describe('UserService tests', function () {
    this.timeout(10000);
    const app = new App(config);
    before(function (done) {
        app.test().then(done);
    });
    beforeEach(function (done) {
        app.db!.query(`delete from "user"`).then(() => {done()});
    });
    after(function(done) {
        app.close().then(done);
    });
    const newUserInfo = {
        id: 1,
        name: 'John',
    };
    describe('Operate user', async function () {
        it('should create a new user', async function () {
            const newUser = await app.service!.user.create(newUserInfo);
            assert.equal(newUser!.name, newUserInfo.name);
        });
        it('should return the user', async function () {
            await app.service!.user.create(newUserInfo);
            const readUser = await app.service!.user.read(newUserInfo);
            assert.equal(readUser!.name, newUserInfo.name);
        });
        it('should modify the user', async function () {
            await app.service!.user.create(newUserInfo);
            const randomName = randomUsername();
            const [ readUser ] = await app.service!.user.update(newUserInfo, {
                name: randomName,
            });
            assert.equal(readUser!.name, randomName);
        });
        it('should delete the user', async function () {
            await app.service!.user.create(newUserInfo);
            const result = await app.service!.user.delete(newUserInfo);
            assert.equal(result, true);
            const noUser = await app.service!.user.read(newUserInfo);
            assert.equal(noUser, undefined);
        });
    })
});
