import { MongoDB } from '../src/db/mongo';
import { strictEqual as equal, strict as assert } from 'assert';
import { AccountService } from '../src/service/account';
import { User } from '../src/entity/user';
import { UserModel } from '../src/model/user';
import { RelationService } from '../src/service/relation';
import { UserService } from '../src/service/user';
import { getInstance } from '../src/util/container';

const name = 'Lellansin';
const email = 'lellansin@gmail.com';

describe('Service', () => {
  const db = getInstance<MongoDB>('db');

  describe('Account', () => {
    const service = getInstance<AccountService>('accountService');
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

    after(async () => {
      const model = getInstance<UserModel>('userModel');
      await model.delete({ email });
    });
  });

  describe('User', () => {
    const service = getInstance<UserService>('userService');
    const model = getInstance<UserModel>('userModel');

    let closeUser: User;
    let centerUser: User;
    let farUser: User;

    before(async () => {
      const user = new User();
      user.email = 'test@user';
      user.name = name;
      user.password = '123456';
      user.description = 'nice to meet you';
      user.location = [0, 0];
      closeUser = await model.save(user);

      const user1 = new User();
      user1.email = 'test@user1';
      user1.name = name;
      user1.password = '123456';
      user1.description = 'nice to meet you';
      user1.location = [3, 3];
      centerUser = await model.save(user1);

      const user2 = new User();
      user2.email = 'test@user';
      user2.name = name;
      user2.password = '123456';
      user2.description = 'nice to meet you';
      user2.location = [10, 10];
      farUser = await model.save(user2);
    });

    it('should get nearby user list', async () => {
      const result = await service.getNearbyList(centerUser, 0);
      equal(result.length, 3); // 3 users including center user itself

      const [_, one, two] = result;
      equal(String(one._id), String(closeUser._id));
      equal(String(two._id), String(farUser._id));
    });

    after(async () => {
      await model.delete({ _id: closeUser._id });
      await model.delete({ _id: centerUser._id });
      await model.delete({ _id: farUser._id });
    });
  });

  describe('Relation', () => {
    const service = getInstance<RelationService>('relationService');

    const fromUserEmail = 'test1@domain';
    const toUserEmail = 'test2@domain';

    before(async () => {
      const accountService = getInstance<AccountService>('accountService');
      const user1 = new User();
      user1.email = fromUserEmail;
      user1.name = 'Alan';
      user1.password = 'password';
      user1.description = 'nice to meet you';
      await accountService.signUp(user1);

      const user2 = new User();
      user2.email = toUserEmail;
      user2.name = 'Bob';
      user2.password = '123456';
      user2.description = 'nice to be followed';
      await accountService.signUp(user2);
    });

    it('should follow new user', async () => {
      const userModel = getInstance<UserModel>('userModel');
      const fromOne = await userModel.getOneByEmail(fromUserEmail);
      assert(fromOne);

      const toOne = await userModel.getOneByEmail(toUserEmail);
      assert(toOne);

      const { _id: fromId } = fromOne,
        { _id: toId } = toOne;

      await service.follow(fromId, toId);

      const err = await service.follow(fromId, toId).catch((err: Error) => err);
      assert.match(String(err), /Duplicated follow action/);

      const fromOneUpdated = await userModel.getOneByEmail(fromUserEmail);
      equal(fromOneUpdated?.followingNum, 1, 'number not match');

      const toOneUpdated = await userModel.getOneByEmail(toUserEmail);
      equal(toOneUpdated?.followerNum, 1, 'number not match');
    });

    it('should get followers & followings', async () => {
      const userModel = getInstance<UserModel>('userModel');
      const toOne = await userModel.getOneByEmail(toUserEmail);
      assert(toOne);

      const list = await service.getFollowers(toOne, 0);
      equal(list.length, 1);
      const [fromOne] = list;

      const list2 = await service.getFollowing(fromOne, 0);
      equal(list2.length, 1);

      const [one] = list2;
      equal(String(one._id), String(toOne._id));
    });

    it('should unfollow the user', async () => {
      const userModel = getInstance<UserModel>('userModel');
      const fromOne = await userModel.getOneByEmail(fromUserEmail);
      assert(fromOne);

      const toOne = await userModel.getOneByEmail(toUserEmail);
      assert(toOne);

      const { _id: fromId } = fromOne,
        { _id: toId } = toOne;

      await service.unfollow(fromId, toId);

      const fromOneUpdated2 = await userModel.getOneByEmail(fromUserEmail);
      equal(fromOneUpdated2?.followingNum, 0, 'number not match');

      const toOneUpdated2 = await userModel.getOneByEmail(toUserEmail);
      equal(toOneUpdated2?.followerNum, 0, 'number not match');
    });

    after(async () => {
      const userModel = getInstance<UserModel>('userModel');
      await userModel.delete({ email: fromUserEmail });
      await userModel.delete({ email: toUserEmail });
    });
  });

  after(() => {
    db.close();
  });
});
