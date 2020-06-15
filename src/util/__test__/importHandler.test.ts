import mongoose from 'mongoose';
import importHandler from '../importHandler';
import getModelList from '../modelScanner';
import { isShuttleModel } from '../../models/shuttleModel';
import { TestDBManager } from '../../database';

const testDB = new TestDBManager();
beforeAll(async () => testDB.start());
afterAll(async () => testDB.stop());

describe('importHandler', () => {
  describe('importOne', () => {
    it('should be able to import every shuttle model', async () => {
      let modelList = await getModelList();
      modelList = modelList.filter((model) => model !== 'user');
      const importedList = await Promise.all(
        modelList.map((model) => {
          return importHandler.importOne(`../model/${model}`);
        })
      );
      // should all succeed
      importedList.forEach((imported) => {
        expect(isShuttleModel(imported)).toBe(true);
      });
    });

    it('should be able to import mongoose model', async () => {
      const user = await importHandler.importOne(`../model/user`);
      expect(user.prototype instanceof mongoose.Model).toBe(true);
    });
  });
});
