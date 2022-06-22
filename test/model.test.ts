import { User as UserModel } from '../src/model/user';
import { User } from '../src/entity/user';
import { MongoDB } from '../src/db/mongo';
import { strictEqual as equal, strict as assert } from 'assert';
import { ObjectID } from 'typeorm';
import { FollowerModel } from '../src/model/follower';

const { ObjectId } = require('mongodb');
const name = 'Lellansin';
const email = 'lellansin@gmail.com';

describe('Model', () => {
  const db = new MongoDB();

  describe('User', () => {
    const model = new UserModel(db);
    let userCreatedId: ObjectID;

    it('create a user', async () => {
      const user = new User();
      user.email = email;
      user.name = name;
      user.password = '123456';
      const result = await model.create(user);
      userCreatedId = result._id;
    });

    it('get the user created', async () => {
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
      const user = new User();
      user.email = 'lellansin@qq.com';
      const { affected } = await model.update({ _id: userCreatedId }, user);
      equal(affected, 1);
    });

    it('delete the created user', async () => {
      const { affected } = await model.delete({ _id: userCreatedId });
      equal(affected, 1);
    });
  });

  describe('Follow', () => {
    const model = new FollowerModel(db);

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

      // get 1st followed one's followers
      const [one] = following;
      const followers = await model.getFollowing(one.toId);
      assert(Array.isArray(followers));
      assert(followers.length);
    });

    after(() => {
      return model.repo.delete({});
    });
  });

  after(() => {
    db.close();
  });
});
