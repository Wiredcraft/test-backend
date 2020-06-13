import test from 'ava';
import { buildFastify } from '../utils';
import { user as userRoute } from '../../src/routes/user';
import { unixTime } from '../../src/libraries';
import { initBasicContext } from '../utils';
import { FastifyInstance } from 'fastify';

initBasicContext();

const buildUser = () => {
  return {
    name: 'router',
    dob: unixTime(),
    address: 'router-address',
    description: 'router-description',
    email: 'router-email@gmail.com',
    password: 'router-password',
  };
};

test('POST /users should create', async (t) => {
  const fastify = await buildFastify(t, userRoute);
  const user = buildUser();
  const response = await fastify.inject({
    method: 'POST',
    url: '/users',
    payload: user,
  });
  t.deepEqual(response.statusCode, 201);
});

const requestUserToken = (fastify: FastifyInstance, user: any) => {
  return fastify.inject({
    method: 'POST',
    url: '/user-tokens',
    payload: {
      email: user.email,
      password: user.password,
    },
  });
};

const buildUserRequestMeta = async (fastify: FastifyInstance, user: any) => {
  const response = await requestUserToken(fastify, user);
  const { userId, token } = response.json().data;
  const headers = {
    authorization: `Bearer ${token}`,
  };
  return { userId, token, headers };
};

test('POST /user-tokens should create', async (t) => {
  const fastify = await buildFastify(t, userRoute);
  const user = buildUser();
  const response = await requestUserToken(fastify, user);
  t.deepEqual(response.statusCode, 201);
});

test('GET /users should reject without token', async (t) => {
  const fastify = await buildFastify(t, userRoute);
  const response = await fastify.inject({
    method: 'GET',
    url: '/users',
  });
  t.deepEqual(response.statusCode, 401);
});

test('GET /users/:id should reject without token', async (t) => {
  const fastify = await buildFastify(t, userRoute);
  const response = await fastify.inject({
    method: 'GET',
    url: '/users/1',
  });
  t.deepEqual(response.statusCode, 401);
});

test('GET /users should get with token', async (t) => {
  const fastify = await buildFastify(t, userRoute);
  const user = buildUser();
  const { headers } = await buildUserRequestMeta(fastify, user);
  const response = await fastify.inject({
    method: 'GET',
    url: `/users`,
    headers,
  });
  t.deepEqual(response.statusCode, 200);
});

test('GET /users/:id should get with token', async (t) => {
  const fastify = await buildFastify(t, userRoute);
  const user = buildUser();
  const { userId, headers } = await buildUserRequestMeta(fastify, user);
  const response = await fastify.inject({
    method: 'GET',
    url: `/users/${userId}`,
    headers,
  });
  t.deepEqual(response.statusCode, 200);
});

test('GET /users/:id should reject if token is not match with :id', async (t) => {
  const fastify = await buildFastify(t, userRoute);
  const user = buildUser();
  const { userId, headers } = await buildUserRequestMeta(fastify, user);
  const response = await fastify.inject({
    method: 'GET',
    url: `/users/${userId + 1}`,
    headers,
  });
  t.deepEqual(response.statusCode, 403);
});
