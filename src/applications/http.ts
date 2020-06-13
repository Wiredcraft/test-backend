import yargsParser from 'yargs-parser';
import Fastify, { FastifyInstance } from 'fastify';
import jwtPlugin from 'fastify-jwt';
import { ServerResponse } from 'http';
import { bootstrap, context } from '../context';
import * as providers from '../providers';
import * as routes from '../routes';
import * as errors from '../libraries/errors';

const enableSwagger = (server: FastifyInstance) => {
  server.register(require('fastify-swagger'), {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Test swagger',
        description: 'testing the fastify swagger api',
        version: '0.1.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      host: 'localhost',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'user', description: 'User related end-points' },
        { name: 'code', description: 'Code related end-points' },
      ],
      definitions: {
        User: {
          $id: 'User',
          type: 'object',
          required: ['id', 'email'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            firstName: { type: 'string', nullable: true },
            lastName: { type: 'string', nullable: true },
            email: { type: 'string', format: 'email' },
          },
        },
      },
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
    exposeRoute: true,
  });
};

interface Options {
  swagger?: boolean;
}

const main = async () => {
  const parserOptions = {
    boolean: ['swagger'],
  };
  const options = yargsParser(process.argv.slice(2), parserOptions) as Options;

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
    const error = new errors.NotFound(message);
    errorHandler(error, request, reply);
  });
  server.setErrorHandler(errorHandler);

  // setup plugins
  if (options.swagger) {
    enableSwagger(server);
  }
  server.register(jwtPlugin, {
    secret: config.jwt.secret,
  });
  server.register(routes.healthRoute);
  server.register(routes.userRoute, { prefix: 'v1' });
  await server.ready();

  // start server
  const rouetList = server.printRoutes();
  context.logger.info(`Server routes:\n${rouetList}`);
  await server.listen(config.port, config.address);

  // setup graceful shutdown
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
