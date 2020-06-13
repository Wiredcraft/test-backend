import { bootstrap, context } from '../context';
import * as providers from '../providers';
import * as commands from '../commands';

const main = async () => {
  // expire user sessions created before 30 days at 03:01 every day
  context.cron.schedule('1 3 * * *', async () => {
    const command = new commands.UserSessionExpireCommand();
    await command.run({ days: 30 });
  });
};

bootstrap(
  main,
  providers.EnvProvider,
  providers.LoggerProvider,
  providers.CronProvider,
  providers.RedisProvider,
  providers.SequelizeProvider
);
