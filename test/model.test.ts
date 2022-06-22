import { User as UserModel } from '../src/model/user';
import { User as UserEntity } from '../src/entity/user';
import { MongoDB } from '../src/db/mongo';
import { strictEqual as equal, strict as assert } from 'assert';
import { ObjectID } from 'typeorm';

const name = 'Lellansin';
const email = 'lellansin@gmail.com';

describe('Model', () => {
  const db = new MongoDB();

  describe('User', () => {
    const model = new UserModel(db);
    let userCreatedId: ObjectID;

    it('create a user', async () => {
      const user = new UserEntity();
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
      const user = new UserEntity();
      user.email = 'lellansin@qq.com';
      const { affected } = await model.update({ _id: userCreatedId }, user);
      equal(affected, 1);
    });

    it('delete the created user', async () => {
      const { affected } = await model.delete({ _id: userCreatedId });
      equal(affected, 1);
    });
  });

  after(() => {
    db.close();
  });
});
