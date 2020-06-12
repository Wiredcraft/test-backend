import { FastifyInstance, FastifyRequest } from 'fastify';
import { UserController } from '../controllers';
import * as errors from '../libraries/errors';
import * as schemas from './schemas';

const extractOffsetLimit = (data: any) => {
  const offset = data.offset || 1;
  const limit = data.limit || 20;
  return { offset, limit };
};

interface Payload {
  id: number;
  role: string;
}

export const users = async (fastify: FastifyInstance) => {
  const authenticate = async (request: FastifyRequest) => {
    const payload = await request.jwtVerify<Payload>();
    const id = request.params.id;
    if (id !== undefined && payload.id.toString() !== id) {
      throw new errors.Forbidden();
    }
  };

  // create user
  fastify.post(
    '/users',
    {
      schema: {
        body: schemas.userCreateSchema,
        response: {
          201: schemas.userResponseSchema,
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
        email: request.body.email,
        password: request.body.password,
      });
      reply.status(201).send({ data: user });
    }
  );

  // create user token
  fastify.post(
    '/user-tokens',
    {
      schema: {
        body: schemas.userTokenCreateSchema,
        response: {
          201: schemas.userTokenResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const email = request.body.email;
      const password = request.body.password;
      const userController = new UserController();
      const user = await userController.verify({ email, password });
      const payload = { id: user.id, role: user.role };
      const token = fastify.jwt.sign(payload);
      reply.status(201).send({ data: { token, userId: user.id } });
    }
  );

  // list users
  fastify.get(
    '/users',
    {
      preValidation: [authenticate],
      schema: {
        querystring: schemas.userListQueryString,
        response: {
          200: schemas.userListResponseSchema,
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

  // get user
  fastify.get(
    '/users/:id',
    {
      preValidation: [authenticate],
      schema: {
        params: schemas.userParams,
        response: {
          200: schemas.userResponseSchema,
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
      preValidation: [authenticate],
      schema: {
        params: schemas.userParams,
        body: schemas.userUpdateSchema,
        response: {
          200: schemas.userResponseSchema,
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
      preValidation: [authenticate],
      schema: {
        params: schemas.userParams,
        response: {
          200: schemas.nullResponseSchema,
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
      preValidation: [authenticate],
      schema: {
        params: schemas.userParams,
        querystring: schemas.userListQueryString,
        response: {
          200: schemas.userListResponseSchema,
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
      preValidation: [authenticate],
      schema: {
        params: schemas.userParams,
        querystring: schemas.userListQueryString,
        response: {
          200: schemas.userListResponseSchema,
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
      preValidation: [authenticate],
      schema: {
        params: schemas.userParams,
        body: schemas.userFollowerCreateSchema,
        response: {
          201: schemas.userFollowerResponseSchema,
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
      preValidation: [authenticate],
      schema: {
        params: { ...schemas.userParams, targetId: schemas.userParams.id },
        response: {
          200: schemas.nullResponseSchema,
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
      preValidation: [authenticate],
      schema: {
        params: schemas.userParams,
        querystring: schemas.searchNeighborQueryString,
        response: {
          200: schemas.searchNeighborResponseSchema,
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
