import rng, { RngOption } from '../randomGenerator';

describe('randomGenerator', () => {
  describe('decimal', () => {
    it('should generate a random decimal', () => {
      for (let len = 0; len < 10; ++len) {
        const result = rng(RngOption.decimal, 100, -100);
        expect(typeof result === 'number' && result <= 100 && result >= -100).toBe(true);
      }
    });
  });
  describe('integer', () => {
    it('should generate a random integer', () => {
      for (let len = 0; len < 10; ++len) {
        const result = rng(RngOption.integer, 100, -100);
        expect(
          typeof result === 'number' && result <= 100 && result >= -100 && result % 1 === 0
        ).toBe(true);
      }
    });
  });
  describe('string', () => {
    it('should generate a random string', () => {
      for (let len = 0; len < 10; ++len) {
        const result = rng(RngOption.string, 10);
        expect(typeof result === 'string' && result.length === 10).toBe(true);
      }
    });
  });

  describe('array', () => {
    it('should generate a random number array', () => {
      for (let len = 0; len < 10; ++len) {
        const result = rng(RngOption.array, 100, -100, 10);
        expect(Array.isArray(result)).toBe(true);
        expect(result.every((r) => r <= 100 && r >= -100 && r % 1 === 0)).toBe(true);
        expect(result.length === 10).toBe(true);
      }
    });
  });
});
