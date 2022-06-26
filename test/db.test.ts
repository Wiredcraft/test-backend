import { MongoDB } from '../src/db/mongo';
import { strict } from 'assert/strict';
import { getInstance } from '../src/util/container';
import { User } from '../src/entity/user';

describe('DB', () => {
  const db = getInstance<MongoDB>('db');

  describe('User', () => {
    it('findAll', async () => {
      const repo = await db.getRepo<User>(User);
      const res = await repo.find();
      strict(Array.isArray(res));
    });
  });

  after(async () => {
    await db.close();
  });
});
