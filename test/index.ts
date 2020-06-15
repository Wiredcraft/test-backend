import * as providers from '../src/providers';
import { bootstrap, shutdown } from '../src/context';
import { clearRedis, resetSequelize } from './utils';

const main = async () => {
  console.log('Init test...');
  await clearRedis();
  await resetSequelize();
  await shutdown();
};

bootstrap(
  main,
  providers.EnvProvider,
  providers.ConfigProvider,
  providers.LoggerProvider,
  providers.RedisProvider,
  providers.SequelizeProvider
);
