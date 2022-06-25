import { ObjectID } from 'typeorm';
import { strictEqual as equal, strict as assert } from 'assert';
import { User } from '../src/entity/user';
import { MongoDB, ObjectId } from '../src/db/mongo';
import { UserModel } from '../src/model/user';
import { RelationModel, FollowType } from '../src/model/relation';
import { getInstance } from '../src/util/container';
import { TokenModel } from '../src/model/token';
import { Token } from '../src/entity/token';

const name = 'Lellansin';
const email = 'lellansin@gmail.com';

describe('Model', () => {
  const db = getInstance<MongoDB>('db');

  describe('User', () => {
    const model = getInstance<UserModel>('userModel');
    let userCreatedId: ObjectID;

    it('create a user', async () => {
      const user = new User();
      user.email = email;
      user.name = name;
      user.password = '123456';
      const result = await model.save(user);
      userCreatedId = result._id;
    });

    it('get the user created by email & id', async () => {
      const user1 = await model.getOneByEmail(email);
      assert(user1, 'user not found');
      equal(user1.email, email);
      equal(user1.name, name);

      const user2 = await model.getOneById(String(userCreatedId));
      assert(user2, 'user not found');
      equal(user2.email, email);
      equal(user2.name, name);
    });

    it('update the user created', async () => {
      const email = 'lellansin@qq.com';
      const user = new User();
      user.email = email;
      const { affected } = await model.update({ _id: userCreatedId }, user);
      equal(affected, 1);

      const user2 = await model.getOneById(String(userCreatedId));
      equal(user2?.email, email);
    });

    it('should update the user follow num', async () => {
      const result = await model.updateFollowNum(
        userCreatedId,
        FollowType.FOLLOW
      );
      equal(result.affected, 1);
    });

    it('delete the created user', async () => {
      const { affected } = await model.delete({ _id: userCreatedId });
      equal(affected, 1);
    });
  });

  describe('Relation', () => {
    const model = getInstance<RelationModel>('relationModel');

    // 10 followers
    const fromIds = Array(10)
      .fill(null)
      .map(() => ObjectId());
    // half following
    const toIds = [
      fromIds[0], // ensure at least 1 following
      ...fromIds.slice(1).filter(() => Math.random() > 0.5) // random half rest
    ];

    it('should insert a follow relationship', async () => {
      // let the fromIds follow toIds
      for (const fromId of fromIds) {
        for (const toId of toIds) {
          await model.follow(fromId, toId);
        }
      }
    });

    it('should get following & followers', async () => {
      // get 1st one's following list
      const [fromId] = fromIds;
      const following = await model.getFollowing(fromId);
      assert(Array.isArray(following));
      assert(following.length);

      // get followed one's followers
      const [one] = following;
      const followers = await model.getFollowing(one.toId);
      assert(Array.isArray(followers));
      assert(followers.length);
    });

    it('should unfollow', async () => {
      const [fromId] = fromIds;
      const following = await model.getFollowing(fromId);
      const { toId } = following[0];

      const flag = await model.isFollowed(fromId, toId);
      assert(flag);

      const result = await model.unfollow(fromId, toId);
      assert(result?.affected);

      const followed = await model.isFollowed(fromId, toId);
      assert(!followed);
    });

    after(async () => {
      const repo = await db.getFollower();
      return repo.delete({});
    });
  });

  describe('Token', () => {
    const model = getInstance<TokenModel>('tokenModel');
    const uids: ObjectID[] = [];

    it('should create a new token and get it, then disable it', async () => {
      const uid = ObjectId();
      uids.push(uid);
      const clientId = '12345';
      const token = new Token(uid, clientId);
      const { _id } = await model.create(token);

      // get by id
      const entity1 = await model.getById(_id);
      assert(entity1);
      equal(entity1.clientId, clientId);

      // get by uid
      const entity2 = await model.getOneByUid(uid, clientId);
      assert(entity2);
      equal(String(entity2._id), String(_id));

      // disable the token
      const result = await model.disable(_id);
      equal(result.affected, 1);

      // should not found the token
      const entity3 = await model.getById(_id);
      equal(entity3, null);

      // should not found the token
      const entity4 = await model.getOneByUid(uid, clientId);
      equal(entity4, null);
    });

    it('should get null while out of ttl', async () => {
      const uid = ObjectId();
      uids.push(uid);
      const clientId = '';
      const token = new Token(uid, clientId);
      // out of ttl (4 days / ttl 3 days)
      token.createdAt = new Date(Date.now() - 1000 * 60 * 60 * 24 * 4);
      const createdToken = await model.create(token);
      assert(createdToken);

      const notFoundNull = await model.getById(createdToken._id);
      equal(notFoundNull, null);

      const notFoundNull2 = await model.getOneByUid(uid, clientId);
      equal(notFoundNull2, null);
    });

    after(async () => {
      const repo = await db.getToken();
      await Promise.all(uids.map((uid) => repo.delete({ _id: uid })));
    });
  });

  after(() => {
    db.close();
  });
});
