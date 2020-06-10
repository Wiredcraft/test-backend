import { Logger } from './logger';

export type CleanFunction = () => Promise<void>;

export class Cleaner {
  private funcs: CleanFunction[] = [];

  constructor(private logger: Logger) {}

  push(func: CleanFunction) {
    this.funcs.push(func);
  }

  async drain() {
    while (this.funcs.length > 0) {
      const func = this.funcs.pop() as CleanFunction;
      try {
        await func();
      } catch (error) {
        this.logger.error(error, 'Clean function error');
      }
    }
  }
}
