import test from 'ava';
import { buildFastify } from '../utils';
import { health } from '../../src/routes/health';

test('GET /health', async (t) => {
  const fastify = await buildFastify(t, health);
  const response = await fastify.inject({
    method: 'GET',
    url: '/health',
  });
  t.deepEqual(response.statusCode, 200);
  t.deepEqual(response.json(), { status: 'ok' });
});
