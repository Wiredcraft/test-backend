import * as providers from '../providers';
import { bootstrap, context } from '../context';

const main = async () => {
  const { logger, cron } = context;

  // use interval syntax
  cron.schedule('@every 1s', async () => {
    logger.info('every second');
  });

  // use crontab syntax
  cron.schedule('*/5 * * * * *', async () => {
    logger.info('at 5th second');
  });
};

bootstrap(main, providers.EnvProvider, providers.LoggerProvider, providers.CronProvider);
