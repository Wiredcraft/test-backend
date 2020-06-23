import mongoose from 'mongoose';

import { importMany, importOne } from '../importHelper';

describe('importHelper', () => {
  describe('importOne', () => {
    it('should be able to import existing model', async () => {
      const user = await importOne(`${__dirname}/../../models/user`);
      expect(user.prototype instanceof mongoose.Model).toBe(true);
    });

    it('should fail to import non-existing model', async () => {
      const result = await importOne(`${__dirname}/../../models/123`);
      expect(result).toBe(undefined);
    });
  });

  describe('importMany', () => {
    it('should be able to import multiple models at once', async () => {
      const results = await importMany(
        ['user', 'access'].map((modelName) => `${__dirname}/../../models/${modelName}`)
      );
      expect(results.every((result) => result.prototype instanceof mongoose.Model)).toBe(true);
    });

    it('should remove non-existing models from result ', async () => {
      const results = await importMany(
        ['user', 'access', '123'].map((modelName) => `${__dirname}/../../models/${modelName}`)
      );
      expect(results.length).toBe(2);
      expect(results.every((result) => result.prototype instanceof mongoose.Model)).toBe(true);
    });
  });
});
