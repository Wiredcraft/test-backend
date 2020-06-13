import * as providers from '../src/providers';
import * as commands from '../src/commands';
import { bootstrap, context, shutdown } from '../src/context';

const prepareRedis = async () => {
  const { keyPrefix } = context.config.providers.redis;
  if (!keyPrefix.startsWith('test')) {
    throw new Error(`Invalid key prefix ${keyPrefix}, must contain "test"`);
  }
  const prefixedKeys = await context.redis.keys(`${keyPrefix}*`);
  if (prefixedKeys.length > 0) {
    const keys = prefixedKeys.map((item) => item.slice(keyPrefix.length));
    await context.redis.del(keys);
  }
};

const prepareSequelize = async () => {
  const { database } = context.config.providers.sequelize;
  if (!database.includes('test')) {
    throw new Error(`Invalid database name "${database}", must contain "test"`);
  }
  for (const model of Object.values(context.sequelize.models)) {
    await model.drop();
  }
  const initCommand = new commands.MigrationInitCommand();
  await initCommand.run();
  const upCommand = new commands.MigrationUpCommand();
  await upCommand.run();
};

const main = async () => {
  console.log('Init test...');
  await prepareRedis();
  await prepareSequelize();
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
