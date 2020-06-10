import test from 'ava';
import { parseEnv, NodeEnv } from '../../src/libraries/env';

test('parseEnv should parse NODE_ENV', async (t) => {
  const cases = [NodeEnv.Test, NodeEnv.Development, NodeEnv.Staging, NodeEnv.Production];
  for (const expected of cases) {
    const output = parseEnv({ NODE_ENV: expected });
    t.deepEqual(output.nodeEnv, expected);
  }
});

test('parseEnv should throw for invalid NODE_ENV', async (t) => {
  const cases = ['a', 'b', 'c', '', undefined];
  for (const item of cases) {
    t.throws(
      () => {
        parseEnv({ NODE_ENV: item });
      },
      undefined,
      `should throw for "${item}"`
    );
  }
});
