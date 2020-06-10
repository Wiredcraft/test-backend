import Fastify from 'fastify';
import { bootstrap, context } from '../context';
import * as providers from '../providers';
import * as routes from '../routes';

const main = async () => {
  const server = Fastify({
    ajv: {
      customOptions: {
        coerceTypes: false,
      },
    },
    logger: context.logger,
  });

  server.register(routes.health);
  await server.ready();

  const rouetList = server.printRoutes();
  context.logger.info(`Server routes:\n${rouetList}`);

  const config = context.config.applications.http;
  await server.listen(config.port, config.address);

  context.cleaner.push(async () => {
    context.logger.info(`Server shutdown...`);
    try {
      await server.close();
    } catch (err) {
      context.logger.error(err);
    }
  });
};

bootstrap(
  main,
  providers.EnvProvider,
  providers.CleanerProvider,
  providers.ConfigProvider,
  providers.LoggerProvider,
  providers.RedisProvider,
  providers.SequelizeProvider
);
