import { MongoDB } from '../src/db/mongo';
import { strictEqual as equal, strict as assert } from 'assert';
import { UserService } from '../src/service/user';
import { User } from '../src/entity/user';
import { UserModel } from '../src/model/user';

const name = 'Lellansin';
const email = 'test@domain';

describe('Service', () => {
  const db = new MongoDB();

  describe('User', () => {
    const service = new UserService(db);
    const password = '123456';

    it('sign up a user', async () => {
      const user = new User();
      user.email = email;
      user.name = name;
      user.password = password;
      user.description = 'nice to meet you';
      await service.signUp(user);
    });

    it('sign up witch registered email', async () => {
      const user = new User();
      user.email = email;
      user.name = 'another one';
      user.password = password;
      try {
        await service.signUp(user);
      } catch (err) {
        assert.match(String(err), /Registered email conflict/);
        return;
      }
      assert(false, 'should not come here');
    });

    it('sign in with incorrect password', async () => {
      try {
        await service.signIn(email, 'wrong password');
      } catch (err) {
        assert.match(String(err), /invalid password/);
        return;
      }
      assert(false, 'should not come here');
    });

    it('sign in with correct password', async () => {
      const user = await service.signIn(email, password);
      assert(user, 'sign in failed');
      equal(user.name, name);
    });

    const newUser2Follow = 'test2@domain';

    it('should follow & unfollow new user', async () => {
      const user = new User();
      user.email = newUser2Follow;
      user.name = 'Alan';
      user.password = password;
      user.description = 'nice to be followed';
      const { _id: toId } = await service.signUp(user);

      const userModel = new UserModel(db);
      const fromOne = await userModel.getOneByEmail(email);
      assert(fromOne);

      const { _id: fromId } = fromOne;

      await service.follow(fromId, toId);

      const err = await service.follow(fromId, toId).catch((err: Error) => err);
      assert.match(String(err), /Duplicated follow action/);

      const fromOneUpdated = await userModel.getOneByEmail(email);
      equal(fromOneUpdated?.followingNum, 1, 'number not match');

      const toOneUpdated = await userModel.getOneByEmail(newUser2Follow);
      equal(toOneUpdated?.followerNum, 1, 'number not match');

      await service.unfollow(fromId, toId);

      const fromOneUpdated2 = await userModel.getOneByEmail(email);
      equal(fromOneUpdated2?.followingNum, 0, 'number not match');

      const toOneUpdated2 = await userModel.getOneByEmail(newUser2Follow);
      equal(toOneUpdated2?.followerNum, 0, 'number not match');
    });

    after(async () => {
      await service.userModel.delete({ email });
      await service.userModel.delete({ email: newUser2Follow });
    });
  });

  after(() => {
    db.close();
  });
});
