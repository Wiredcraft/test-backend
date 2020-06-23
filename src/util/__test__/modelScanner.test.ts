import { getModelList } from '../modelScanner';

describe('modelScanner', () => {
  describe('getModelList', () => {
    it('should contain all available static models', async () => {
      expect(await getModelList()).toEqual(expect.arrayContaining(['access', 'user']));
    });
  });
});
