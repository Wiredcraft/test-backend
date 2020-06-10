import test from 'ava';
import * as utils from '../../src/libraries/utils';

test('delay should trigger after seconds', async (t) => {
  t.plan(1);
  const tic = Date.now();
  await utils.delay(1000);
  const toc = Date.now();
  const elapsed = Math.floor((toc - tic) / 1000);
  t.assert(elapsed === 1, `elapsed: ${elapsed}s`);
});

test('unixTime should be number of seconds', (t) => {
  const tic = utils.unixTime();
  const toc = Math.floor(Date.now() / 1000);
  const elapsed = toc - tic;
  t.assert(elapsed === 0, `elapsed: ${elapsed}s`);
});

test('matchSourceFileName should accept source file name', (t) => {
  const cases: [string, boolean][] = [
    ['a.js', true],
    ['a.d.js', true],
    ['a.ts', true],
    ['a.d.ts', false],
    ['./a.d/b.js', true],
    ['./a.d/b.ts', true],
    ['./a.d/b.d.ts', false],
    ['/a', false],
    ['/a/b', false],
    ['/a/b/c', false],
    ['/a/b/c.txt', false],
    ['/a/b/c.js', true],
    ['/a/b/c.ts', true],
    ['/a/b/c.d.ts', false],
  ];
  for (const [input, expected] of cases) {
    const actual = utils.matchSourceFileName(input);
    t.deepEqual(actual, expected, `match: ${input}, expected: ${expected}`);
  }
});
