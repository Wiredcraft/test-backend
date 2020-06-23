import { Colors } from '../consts';
import { getLogger } from '../logger';

const spies: jest.SpyInstance[] = [];
jest.useFakeTimers();

beforeAll(() => {
  // Lock Time
  spies.push(jest.spyOn(global.console, 'log'));
  spies.push(jest.spyOn(Date, 'now').mockImplementation(() => 1487076708000));
  spies.push(jest.spyOn(Date.prototype, 'getDay').mockReturnValue(2));
  spies.push(jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2000-01-01T00:00:00.000Z'));
});

afterAll(() => {
  // Unlock Time
  spies.forEach((spy) => spy.mockRestore());
});

describe('Logger', () => {
  describe('getLogger', () => {
    it('should be able to output string message', () => {
      const logger = getLogger('test');
      logger.info('example message');
      expect(global.console.log).toBeCalledWith(
        `2000-01-01T00:00:00.000Z - ${Colors.FgGreen}[Info][test]example message${Colors.Reset}`
      );
    });
  });
});
