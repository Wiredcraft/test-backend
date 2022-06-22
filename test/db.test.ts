import { MongoDB } from '../src/db/mongo';
import { strict } from 'assert/strict';

describe('DB', () => {
  const db = new MongoDB();

  describe('User', () => {
    it('findAll', async () => {
      const repo = await db.getUser();
      const res = await repo.find();
      strict(Array.isArray(res));
    });
  });

  after(async () => {
    await db.close();
  });
});
