import test from 'ava';
import * as errors from '../../src/libraries/errors';

for (const errorCtor of Object.values(errors)) {
  test(`${errorCtor.name} instance should have name`, (t) => {
    const instance = new errorCtor();
    t.deepEqual(instance.name, errorCtor.name);
  });
}
