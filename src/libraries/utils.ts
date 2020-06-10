import { DateTime } from 'luxon';

export function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

export function unixTime() {
  return Math.floor(DateTime.utc().toSeconds());
}

/**
 * Check whether a file name looks like JavaScript or TypeScript source file
 * @param name Source file name.
 * @returns True if matched, false otherwise.
 */
export function matchSourceFileName(name: string) {
  const pattern = /.+((\.js)|((?<!\.d)\.ts))$/g;
  return pattern.test(name);
}
