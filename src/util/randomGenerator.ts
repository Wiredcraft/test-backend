/**
 * Enum for random generator options.
 * @readonly
 * @enum {string}
 */
export enum RngOption {
  /** @member {string} */
  /** option for random decimal, like 3.14, 1.23 */
  decimal = 'decimal',
  /** @member {string} */
  /** option for random integer, like 42, 3 */
  integer = 'integer',
  /** @member {string} */
  /** option for random alphaNum string, like adov23lj,u9taldfz */
  string = 'string',
  /** @member {string} */
  /** option for random number array, like [3,2,4,1,6] */
  array = 'array',
}

/**
 * Generate a random decimal, integer or string
 * @param {RngOption} option an option indicate the type of random value it generates
 * @param {number} max upper limit of the generated number, length of string
 * @param {number} min lower limit of the generated number (optional, defaults to 0)
 * @returns {number|string} a random value that fulfills the above requirements
 */
export default function rng<T extends RngOption>(
  option: T,
  max: number,
  min = 0,
  length?: number
): T extends RngOption.string ? string : T extends RngOption.array ? number[] : number {
  type RngReturnType = T extends RngOption.string
    ? string
    : T extends RngOption.array
    ? number[]
    : number;
  let result: RngReturnType;
  switch (option) {
    case RngOption.decimal:
      result = (Math.random() * (max - min) + min) as RngReturnType;
      break;
    case RngOption.integer:
      result = (Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
        Math.ceil(min)) as RngReturnType;
      break;
    case RngOption.string:
      result = Array(max)
        .fill(0)
        .map(() => Math.random().toString(36).charAt(2))
        .join('') as RngReturnType;
      break;
    case RngOption.array:
      if (length) {
        result = Array.from(
          { length },
          () => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)
        ) as RngReturnType;
      } else {
        throw new Error('length must be provided when using array option');
      }
      break;
    default:
      throw new Error(`Invalid options passed in: ${option}`);
  }
  return result;
}
