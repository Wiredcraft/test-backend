import { ServerResponse } from 'http';
import fastify, { FastifyInstance } from 'fastify';
import * as errors from '../libraries/errors';

export async function errorHandler(server: FastifyInstance) {
  const handleError = (
    error: fastify.FastifyError,
    _request: fastify.FastifyRequest,
    reply: fastify.FastifyReply<ServerResponse>
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
    handleError(error, request, reply);
  });
  server.setErrorHandler(handleError);
}
