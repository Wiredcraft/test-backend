import test, { ExecutionContext } from 'ava';
import Fastify from 'fastify';
import { VertexFactory } from 'dag-maker';
import { context } from '../src/context';
import * as providers from '../src/providers';

export function initContext(...providerFactories: VertexFactory<any>[]) {
  test.before(async () => {
    await context.initialize({ providerFactories: providerFactories });
  });
}

export function initBasicContext() {
  initContext(providers.ConfigProvider, providers.SequelizeProvider);
}

type RoutePlugin = (fastify: Fastify.FastifyInstance) => Promise<void>;

export async function buildFastify(t: ExecutionContext<unknown>, ...routePlugins: RoutePlugin[]) {
  const fastify = Fastify();
  for (const plugin of routePlugins) {
    fastify.register(plugin);
  }
  await fastify.ready();
  t.teardown(() => fastify.close());
  return fastify;
}
