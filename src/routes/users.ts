import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers';

const nullResponseSchema = {
  type: 'object',
  properties: {
    data: { type: 'null' },
  },
};

const userParams = {
  id: { type: 'number', minimum: 1 },
};

const userListQueryString = {
  offset: { type: 'number', minimum: 1 },
  limit: { type: 'number', minmum: 1, maximum: 100 },
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

const userFollowerCreateSchema = {
  type: 'object',
  properties: {
    id: { type: 'number', minimum: 1 },
  },
};

const userFollowerResponseSchema = {
  type: 'object',
  properties: {
    data: userFollowerCreateSchema,
  },
};

const searchNeighborQueryString = {
  limit: { type: 'number', minmum: 1, maximum: 100 },
};

const searchNeighborResponseSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: userItemSchema,
    },
  },
};

const extractOffsetLimit = (data: any) => {
  const offset = data.offset || 1;
  const limit = data.limit || 20;
  return { offset, limit };
};

export const users = async (fastify: FastifyInstance) => {
  // list users
  fastify.get(
    '/users',
    {
      schema: {
        querystring: userListQueryString,
        response: {
          200: userListResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { offset, limit } = extractOffsetLimit(request.query);
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
          200: nullResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const userController = new UserController();
      await userController.delete(request.params.id);
      reply.send({ data: null });
    }
  );

  // list followers
  fastify.get(
    '/users/:id/followers',
    {
      schema: {
        params: userParams,
        querystring: userListQueryString,
        response: {
          200: userListResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const id = request.params.id;
      const { offset, limit } = extractOffsetLimit(request.query);
      const userController = new UserController();
      const [total, items] = await Promise.all([
        userController.countFollowers(id),
        userController.listFollowers(id, offset, limit),
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

  // list followings
  fastify.get(
    '/users/:id/followings',
    {
      schema: {
        params: userParams,
        querystring: userListQueryString,
        response: {
          200: userListResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const id = request.params.id;
      const { offset, limit } = extractOffsetLimit(request.query);
      const userController = new UserController();
      const [total, items] = await Promise.all([
        userController.countFollowings(id),
        userController.listFollowings(id, offset, limit),
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

  // create following
  fastify.post(
    '/users/:id/followings',
    {
      schema: {
        params: userParams,
        body: userFollowerCreateSchema,
        response: {
          201: userFollowerResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const userController = new UserController();
      const fromId = request.params.id;
      const toId = request.body.id;
      await userController.follow(fromId, toId);
      reply.status(201).send({ data: { id: toId } });
    }
  );

  // delete following
  fastify.delete(
    '/users/:id/followings/:targetId',
    {
      schema: {
        params: { ...userParams, targetId: userParams.id },
        response: {
          200: nullResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const userController = new UserController();
      const fromId = request.params.id;
      const toId = request.params.targetId;
      await userController.unfollow(fromId, toId);
      reply.send({ data: null });
    }
  );

  // search neighbors
  fastify.get(
    '/users/:id/neighbors',
    {
      schema: {
        params: userParams,
        querystring: searchNeighborQueryString,
        response: {
          200: searchNeighborResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const userController = new UserController();
      const id = request.params.id;
      const limit = request.query.limit || 10;
      const neighbors = await userController.searchNeighbors(id, limit);
      reply.send({ data: neighbors });
    }
  );
};
