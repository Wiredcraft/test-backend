import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers';

const userParams = {
  id: { type: 'number', minimum: 1 },
};

const userCreateSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    dob: { type: 'number' },
    address: { type: 'string' },
    description: { type: 'string' },
    password: { type: 'string', minLength: 8, maxLength: 16 },
  },
  required: ['name', 'dob', 'address', 'description', 'password'],
};

const userUpdateSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    dob: { type: 'number' },
    address: { type: 'string' },
    description: { type: 'string' },
    password: { type: 'string', minLength: 8, maxLength: 16 },
    location: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: [
        { type: 'number', minimum: -90, maximum: 90 },
        { type: 'number', minimum: -180, maximum: 180 },
      ],
    },
  },
};

const userItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    dob: { type: 'number' },
    address: { type: 'string' },
    description: { type: 'string' },
    location: {
      oneOf: [
        { type: 'null' },
        {
          type: 'array',
          minItems: 2,
          maxItems: 2,
          items: [
            { type: 'number', minimum: -90, maximum: 90 },
            { type: 'number', minimum: -180, maximum: 180 },
          ],
        },
      ],
    },
    createdAt: { type: 'number' },
  },
};

const userResponseSchema = {
  type: 'object',
  properties: {
    data: userItemSchema,
  },
};

const userListResponseSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        offset: { type: 'number' },
        limit: { type: 'number' },
        count: { type: 'number' },
        items: { type: 'array', items: userItemSchema },
      },
    },
  },
};

export const users = async (fastify: FastifyInstance) => {
  // list users
  fastify.get(
    '/users',
    {
      schema: {
        querystring: {
          offset: { type: 'number', minimum: 0 },
          limit: { type: 'number', minmum: 1, maximum: 100 },
        },
        response: {
          200: userListResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const offset = request.query.offset || 0;
      const limit = request.query.limit || 20;
      const userController = new UserController();
      const [total, items] = await Promise.all([
        userController.count(),
        userController.list({ offset, limit }),
      ]);
      reply.send({
        data: {
          total,
          offset,
          limit,
          count: items.length,
          items: items,
        },
      });
    }
  );

  // create user
  fastify.post(
    '/users',
    {
      schema: {
        body: userCreateSchema,
        response: {
          201: userResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const userController = new UserController();
      const user = await userController.create({
        name: request.body.name,
        dob: request.body.dob,
        address: request.body.address,
        description: request.body.description,
        password: request.body.password,
      });
      reply.status(201).send({ data: user });
    }
  );

  // get user
  fastify.get(
    '/users/:id',
    {
      schema: {
        params: userParams,
        response: {
          200: userResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const userController = new UserController();
      const user = await userController.get(request.params.id);
      reply.send({ data: user });
    }
  );

  // update user
  fastify.put(
    '/users/:id',
    {
      schema: {
        params: userParams,
        body: userUpdateSchema,
        response: {
          200: userResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const userController = new UserController();
      const user = await userController.update(request.params.id, request.body);
      const data = user;
      reply.send({ data });
    }
  );

  // delete user
  fastify.delete(
    '/users/:id',
    {
      schema: {
        params: userParams,
        response: {
          200: {
            type: 'object',
            properties: {
              data: { type: 'null' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const userController = new UserController();
      await userController.delete(request.params.id);
      reply.send({ data: null });
    }
  );
};
