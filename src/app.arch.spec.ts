import 'tsarch/dist/jest';
import { filesOfProject } from 'tsarch';

/**
 * Regex pattern that matches implementation only (does not match to *.spec.ts)
 * @see https://regexr.com/5orsn
 */
const NOT_SPEC = '^[^\\.]*(?!\\.spec)\\.ts$';

describe('architecture', () => {
  jest.setTimeout(60000);

  describe('presentation tier', () => {
    it('should not depend on domain tier', async () => {
      const rule = filesOfProject()
        .inFolder('presentation')
        .matchingPattern(NOT_SPEC)
        .shouldNot()
        .dependOnFiles()
        .inFolder('domain');

      await expect(rule).toPassAsync();
    });
    it('should not depend on infra tier', async () => {
      const rule = filesOfProject()
        .inFolder('presentation')
        .matchingPattern(NOT_SPEC)
        .shouldNot()
        .dependOnFiles()
        .inFolder('infra');

      await expect(rule).toPassAsync();
    });
  });
  describe('application tier', () => {
    it('should not depend on presentation tier', async () => {
      const rule = filesOfProject()
        .inFolder('application')
        .matchingPattern(NOT_SPEC)
        .shouldNot()
        .dependOnFiles()
        .inFolder('presentation');

      await expect(rule).toPassAsync();
    });
  });
  describe('infra tier', () => {
    it('should not depend on presentation tier', async () => {
      const rule = filesOfProject()
        .inFolder('infra')
        .matchingPattern(NOT_SPEC)
        .shouldNot()
        .dependOnFiles()
        .inFolder('presentation');

      await expect(rule).toPassAsync();
    });
    it('should not depend on application tier', async () => {
      const rule = filesOfProject()
        .inFolder('infra')
        .matchingPattern(NOT_SPEC)
        .shouldNot()
        .dependOnFiles()
        .inFolder('application');

      await expect(rule).toPassAsync();
    });
  });
  describe('domain tier', () => {
    it('should not depend on presentation tier', async () => {
      const rule = filesOfProject()
        .inFolder('domain')
        .matchingPattern(NOT_SPEC)
        .shouldNot()
        .dependOnFiles()
        .inFolder('presentation');

      await expect(rule).toPassAsync();
    });
    it('should not depend on application tier', async () => {
      const rule = filesOfProject()
        .inFolder('domain')
        .matchingPattern(NOT_SPEC)
        .shouldNot()
        .dependOnFiles()
        .inFolder('application');

      await expect(rule).toPassAsync();
    });
    it('should not depend on infra tier', async () => {
      const rule = filesOfProject()
        .inFolder('domain')
        .matchingPattern(NOT_SPEC)
        .shouldNot()
        .dependOnFiles()
        .inFolder('infra');

      await expect(rule).toPassAsync();
    });
  });
});
