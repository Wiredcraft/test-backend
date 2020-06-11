import Fastify from 'fastify';
import jwtPlugin from 'fastify-jwt';
import { ServerResponse } from 'http';
import { bootstrap, context } from '../context';
import * as providers from '../providers';
import * as routes from '../routes';
import * as exceptions from '../libraries/errors';

const main = async () => {
  const config = context.config.applications.http;

  const server = Fastify({
    ajv: {
      customOptions: {
        coerceTypes: true,
        allErrors: true,
      },
    },
    logger: context.logger,
  });

  // setup error handlers
  const errorHandler = (
    error: Fastify.FastifyError,
    _request: Fastify.FastifyRequest,
    reply: Fastify.FastifyReply<ServerResponse>
  ) => {
    let errorName = error.name;
    let statusCode: number;
    if (error.statusCode) {
      statusCode = error.statusCode;
    } else if (error.validation) {
      errorName = 'ValidationError';
      statusCode = 400;
    } else {
      statusCode = 500;
    }
    reply.code(statusCode).send({
      error: errorName,
      message: error.message,
      statusCode,
    });
  };
  server.setNotFoundHandler((request, reply) => {
    const message = `Resource not found: ${request.req.url}, method: ${request.req.method}`;
    const error = new exceptions.NotFound(message);
    errorHandler(error, request, reply);
  });
  server.setErrorHandler(errorHandler);

  // setup plugins
  server.register(routes.health);
  server.register(routes.users, { prefix: 'v1' });
  server.register(jwtPlugin, {
    secret: config.jwt.secret,
  });
  await server.ready();

  const rouetList = server.printRoutes();
  context.logger.info(`Server routes:\n${rouetList}`);
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
