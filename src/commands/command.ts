import { Options } from 'yargs-parser';

// For syntax of options, see: https://www.npmjs.com/package/yargs-parser#api
export interface Command {
  readonly name: string;
  readonly options: Options;
  run(options?: unknown): Promise<void>;
}
