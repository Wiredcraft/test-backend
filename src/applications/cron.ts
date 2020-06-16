import { Cron } from 'recron';
import { bootstrap, Application } from '../context';
import * as providers from '../providers';
import * as commands from '../commands';

class CronApplication extends Application {
  private cron?: Cron;

  async start() {
    const cron = new Cron();
    await cron.start();

    // expire user sessions created before 30 days at 03:01 every day
    cron.schedule('1 3 * * *', async () => {
      const command = new commands.UserSessionExpireCommand();
      await command.run({ days: 30 });
    });

    this.cron = cron;
  }

  async stop() {
    if (this.cron) {
      await this.cron.stop();
      this.cron = undefined;
    }
  }
}

bootstrap(
  CronApplication,
  providers.EnvProvider,
  providers.LoggerProvider,
  providers.RedisProvider,
  providers.SequelizeProvider
);
