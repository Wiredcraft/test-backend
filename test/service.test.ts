import { MongoDB, ObjectId } from '../src/db/mongo';
import { strictEqual as equal, strict as assert } from 'assert';
import sinon from 'sinon';
import { AccountService } from '../src/service/account';
import { User } from '../src/entity/user';
import { UserModel } from '../src/model/user';
import { RelationService } from '../src/service/relation';
import { UserService } from '../src/service/user';
import { getInstance } from '../src/util/container';
import { AuthService } from '../src/service/auth';
import { ClientMap } from './thridPartyApp';
import { stringify } from 'querystring';
import { Redis } from '../src/db/redis';
import { CacheService } from '../src/service/cache';

const name = 'Lellansin';
const email = 'lellansin@gmail.com';

describe('Service', () => {
  const db = getInstance<MongoDB>('db');
  const redis = getInstance<Redis>('redis');

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
      // clear user data
      await model.delete({});

      closeUser = await model.save(
        User.fromJSON({
          email: 'test@user.test',
          name: name,
          password: '123456',
          description: 'nice to meet you',
          location: [0, 0]
        })
      );

      centerUser = await model.save(
        User.fromJSON({
          email: 'test@user1.test',
          name: name,
          password: '123456',
          description: 'nice to meet you',
          address: 'Mars',
          location: [3, 3]
        })
      );

      farUser = await model.save(
        User.fromJSON({
          email: 'test@user.test',
          name: name,
          password: '123456',
          description: 'nice to meet you',
          location: [10, 10]
        })
      );
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

    const fromUserEmail = 'test1@domain.test';
    const toUserEmail = 'test2@domain.test';

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

      // unfollow again (no effect)
      await service.unfollow(fromId, toId);
    });

    after(async () => {
      const userModel = getInstance<UserModel>('userModel');
      await userModel.delete({ email: fromUserEmail });
      await userModel.delete({ email: toUserEmail });
    });
  });

  describe('Auth', () => {
    const service = getInstance<AuthService>('authService');

    it('should getCallbackUrl & get data with RequestToken from callbackUrl', async () => {
      // Prepare auth params
      const uid = ObjectId();
      const clientId = '12345';
      const redirectUri = 'http://test';
      const timestamp = Date.now();

      // Specify the requestToken
      const stub = sinon.stub(service, 'getRequestToken');
      const token = 'myToken' + Math.random();
      stub.returns(token);

      // Generate callback URL
      const url = await service.getCallbackUrl({
        clientId,
        uid: String(uid),
        redirectUri,
        timestamp,
        permissions: []
      });
      equal(
        url,
        `${ClientMap[clientId].callback}?${stringify({
          request_token: token,
          redirect_uri: redirectUri
        })}`
      );

      // Validate token from callback URL
      const data = await service.getDataByRequestToken(token);
      equal(String(data.uid), String(uid));
      equal(data.clientId, clientId);
    });

    it('should issue a new accessToken and get user data from it', async () => {
      const userModel = getInstance<UserModel>('userModel');
      const user = await userModel.save(
        User.fromJSON({
          email: 'anyway@domain.test',
          name: 'anyway'
        })
      );

      const uid = String(user._id);
      const clientId = 'anyway';
      const { accessToken } = await service.issueAccessToken(uid, clientId, []);
      const { accessToken: repeatedAccessToken } =
        await service.issueAccessToken(uid, clientId, []);
      equal(
        String(accessToken),
        String(repeatedAccessToken),
        'should got same one'
      );

      const user2 = await service.getUserByAccessToken(accessToken);
      assert(user2);

      equal(String(user._id), String(user2._id));
    });

    it('should refresh a accessToken and get user data from it', async () => {
      // Prepare user data
      const userModel = getInstance<UserModel>('userModel');
      const user = await userModel.save(
        User.fromJSON({
          email: 'anyway@domain.test',
          name: 'anyway'
        })
      );

      // Issue token with user data
      const uid = String(user._id);
      const clientId = 'anyway';
      const permissions = ['name'];
      const oldOne = await service.issueAccessToken(uid, clientId, permissions);

      // Refresh token
      const { accessToken } = await service.refreshAccessToken(
        oldOne.accessToken,
        clientId,
        permissions
      );

      // Get user data from refreshed new token
      const user2 = await service.getUserByAccessToken(accessToken);
      assert(user2);

      equal(String(user._id), String(user2._id));
    });
  });

  describe('Cache', () => {
    const service = getInstance<CacheService>('cacheService');

    it('should get null', async () => {
      const value = await service.get('not exists');
      equal(value, null);
    });
  });

  after(() => {
    db.close();
    redis.close();
  });
});
