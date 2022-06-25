import { strictEqual as equal } from 'assert';
import { validateEmail } from '../src/util/utils';

describe('util', () => {
  describe('utils', () => {
    it('shoud validate invalid email', () => {
      const falsy = validateEmail('test@domain');
      equal(falsy, false);
    });
  });
});
