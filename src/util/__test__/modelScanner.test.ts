import getModelList from '../modelScanner';
import ShuttleModel from '../../models/shuttleModel';
import { TestDBManager } from '../../database';

const testDB = new TestDBManager();
beforeAll(async () => testDB.start());
afterAll(async () => testDB.stop());

describe('modelScanner', () => {
  describe('getModelList', () => {
    it('should contain all available static models', async () => {
      expect(await getModelList()).toEqual(
        expect.arrayContaining([
          'article',
          'comment',
          'image',
          'link',
          'note',
          'status',
          'tag',
          'user',
        ])
      );
    });

    it('should discover dynamic models', async () => {
      await new ShuttleModel({
        name: 'testModel',
        hasOwner: true,
        access: 'public',
        content: {
          name: 'String!',
          quantity: 'Number',
        },
      }).save();
      await new ShuttleModel({
        name: 'testModel2',
        hasOwner: true,
        access: 'public',
        content: {
          name: 'String!',
          quantity: 'Number',
        },
      }).save();
      expect(await getModelList()).toEqual(expect.arrayContaining(['testModel', 'testModel2']));
    });
  });
});
