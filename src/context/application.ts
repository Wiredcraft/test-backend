import { context } from './context';

export abstract class Application {
  protected isExitLocked = false;

  /**
   * Application on start callback.
   */
  start?(options?: any): Promise<void>;

  /**
   * Application on stop callback.
   */
  stop?(): Promise<void>;

  /**
   * Shutdown application. Trigger on stop callback and finalize context.
   */
  async exit(ok = true) {
    // lockup
    if (this.isExitLocked) {
      return;
    }
    this.isExitLocked = true;

    // stop application
    let exitCode = ok ? 0 : 1;
    if (this.stop) {
      try {
        await this.stop();
      } catch (err) {
        console.error(err);
        exitCode = 1;
      }
    }

    // finalize context
    try {
      await context.finalize();
    } catch (err) {
      console.error(err);
      exitCode = 1;
    }

    process.exit(exitCode);
  }
}

export interface ApplicationConstructor {
  new (): Application;
  options?: any;
}
