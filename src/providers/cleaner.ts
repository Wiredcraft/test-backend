import { dependencies } from 'dag-maker';
import { forward } from 'forwardit';
import { Logger, Cleaner } from '../libraries';
import { LoggerProvider } from './logger';

declare module './utils' {
  interface Forwards extends Pick<CleanerProvider, 'cleaner'> {}
}

@dependencies({
  loggerProvider: LoggerProvider,
})
export class CleanerProvider {
  @forward
  readonly cleaner: Cleaner;

  readonly logger: Logger;

  constructor(logger: Logger, cleaner: Cleaner) {
    this.logger = logger;
    this.cleaner = cleaner;
  }

  static async create(options: { loggerProvider: LoggerProvider }) {
    const logger = options.loggerProvider.logger;
    logger.info('Create CleanerProvider');
    const cleaner = new Cleaner(logger);
    return new CleanerProvider(logger, cleaner);
  }

  static async destroy(cleanerProvider: CleanerProvider) {
    cleanerProvider.logger.info('Destroy CleanerProvider');
    await cleanerProvider.cleaner.drain();
  }
}
