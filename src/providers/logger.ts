import { dependencies } from 'dag-maker';
import { forward } from 'forwardit';
import pino from 'pino';
import { Logger } from '../libraries';
import { ConfigProvider } from './config';

declare module './utils' {
  interface Forwards extends Pick<LoggerProvider, 'logger'> {}
}

@dependencies({
  configProvider: ConfigProvider,
})
export class LoggerProvider {
  @forward
  readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  static async create(options: { configProvider: ConfigProvider }) {
    const config = options.configProvider.config.providers.logger;
    const loggerOptions = {
      enabled: config.enabled,
      formatters: {
        // Log levels as labels instead of numbers
        // see: https://getpino.io/#/docs/help?id=level-string
        level: (label: string) => ({ level: label }),
      },
    };
    if (this.pretty || config.pretty) {
      Object.assign(loggerOptions, {
        prettyPrint: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'hostname',
        },
      });
    }
    if (config.level) {
      Object.assign(loggerOptions, { level: config.level });
    }
    const loggerStream = pino.destination(config.file || undefined);
    const logger = pino(loggerOptions, loggerStream);
    logger.info('Create LoggerProvider');
    return new LoggerProvider(logger);
  }

  static async destroy(loggerProvider: LoggerProvider) {
    loggerProvider.logger.info('Destroy LoggerProvider');
  }

  /**
   * Force pretty print regardless logger config
   */
  static pretty = false;
}
