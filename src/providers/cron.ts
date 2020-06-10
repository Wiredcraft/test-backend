import { dependencies } from 'dag-maker';
import { forward } from 'forwardit';
import { Cron } from 'recron';
import { LoggerProvider } from './logger';
import { Logger } from '../libraries';

declare module './utils' {
  interface Forwards extends Pick<CronProvider, 'cron'> {}
}

@dependencies({
  loggerProvider: LoggerProvider,
})
export class CronProvider {
  @forward
  readonly cron: Cron;

  readonly logger: Logger;

  constructor(logger: Logger, cron: Cron) {
    this.logger = logger;
    this.cron = cron;
  }

  static async create(options: { loggerProvider: LoggerProvider }) {
    const logger = options.loggerProvider.logger;
    logger.info('Create CronProvider');
    const cron = new Cron();
    await cron.start();
    return new CronProvider(logger, cron);
  }

  static async destroy(cronProvider: CronProvider) {
    cronProvider.logger.info('Destroy CronProvider');
    await cronProvider.cron.stop();
  }
}
