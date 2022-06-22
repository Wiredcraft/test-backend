import { MongoDB } from '../src/db/mongo';
import { strictEqual as equal, strict as assert } from 'assert';
import { User as UserService } from '../src/service/user';
import { User } from '../src/entity/user';

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
        assert.match(String(err), /email '[^']+' has been register/);
        return;
      }
      assert(false, 'should not come here');
    });

    it('sign in with incorrect password', async () => {
      try {
        await service.signIn(email, 'wrong password');
      } catch (err) {
        equal(err, 'invalid password');
        return;
      }
      assert(false, 'should not come here');
    });

    it('sign in with correct password', async () => {
      const user = await service.signIn(email, password);
      assert(user, 'sign in failed');
      equal(user.name, name);
    });

    after(() => {
      return service.model.delete({ email });
    });
  });

  after(() => {
    db.close();
  });
});
