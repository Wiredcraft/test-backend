import sourceMapSupport from 'source-map-support';
import { VertexFactory } from 'dag-maker';
import { context } from './context';

let isShutdownLocked = false;

/**
 * Shutdown application.
 * @returns Is shutdown completed successfully.
 */
export const shutdown = async () => {
  if (isShutdownLocked) {
    return;
  }
  isShutdownLocked = true;
  let isOk = true;
  try {
    await context.finalize();
  } catch (err) {
    console.error(err);
    isOk = false;
  }
  return isOk;
};

const installTraps = () => {
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGUSR2'];
  const signalHandler = async (name: NodeJS.Signals) => {
    context.logger.warn(`Got signal %s`, name);
    const ok = await shutdown();
    const exitCode = ok ? 0 : 1;
    process.exit(exitCode);
  };
  for (const signal of signals) {
    process.on(signal, signalHandler);
  }
  process.on('unhandledRejection', (reason, promise) => {
    console.error(reason, promise);
  });
};

const installSourceMap = () => {
  sourceMapSupport.install({
    environment: 'node',
    hookRequire: true,
  });
};

/**
 * Bootstrap application.
 * @param main Entrance function. It will be called when application context is ready.
 * @param providerFactories Provider factories for making up application context.
 */
export const bootstrap = async (
  main: () => Promise<void>,
  ...providerFactories: VertexFactory<any>[]
) => {
  isShutdownLocked = false;
  try {
    installSourceMap();
    installTraps();
    await context.initialize({ providerFactories: providerFactories });
    await main();
  } catch (err) {
    console.error(err);
    await shutdown();
    process.exit(1);
  }
};
