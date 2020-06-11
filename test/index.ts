import * as providers from '../src/providers';
import * as commands from '../src/commands';
import { bootstrap, context, shutdown } from '../src/context';

const prepareDatabase = async () => {
  const { database } = context.config.providers.sequelize;
  if (!database.includes('test')) {
    throw new Error(`Invalid test database name "${database}", must contain "test"`);
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
  await prepareDatabase();
  await shutdown();
};

bootstrap(
  main,
  providers.EnvProvider,
  providers.ConfigProvider,
  providers.LoggerProvider,
  providers.SequelizeProvider
);
