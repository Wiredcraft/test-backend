import * as providers from '../src/providers';
import { bootstrap, Application } from '../src/context';
import { clearRedis, resetSequelize } from './utils';

class InitTestApplication extends Application {
  async start() {
    console.log('Init test...');
    await clearRedis();
    await resetSequelize();
    await this.exit();
  }
}

bootstrap(
  InitTestApplication,
  providers.EnvProvider,
  providers.ConfigProvider,
  providers.LoggerProvider,
  providers.RedisProvider,
  providers.SequelizeProvider
);
