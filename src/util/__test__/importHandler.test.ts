import mongoose from 'mongoose';

import { importOne } from '../importHelper';

describe('importHelper', () => {
  describe('importOne', () => {
    it('should be able to import one model', async () => {
      const user = await importOne(`${__dirname}/../../models/user`);
      expect(user.prototype instanceof mongoose.Model).toBe(true);
    });
  });
});
