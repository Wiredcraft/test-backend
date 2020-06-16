import sourceMapSupport from 'source-map-support';
import yargsParser from 'yargs-parser';
import { VertexFactory } from 'dag-maker';
import { context } from './context';
import { ApplicationConstructor, Application } from './application';

const installSourceMap = () => {
  sourceMapSupport.install({
    environment: 'node',
    hookRequire: true,
  });
};

const installTraps = (application: Application) => {
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGUSR2'];
  const signalHandler = async (name: NodeJS.Signals) => {
    context.logger.warn(`Got signal %s`, name);
    await application.exit();
  };
  for (const signal of signals) {
    process.on(signal, signalHandler);
  }
  process.on('unhandledRejection', (reason, promise) => {
    console.error(reason, promise);
  });
};

/**
 * Bootstrap an application.
 * @param constructor Application constructor.
 * @param providerFactories Provider factories for making up application context.
 */
export const bootstrap = async (
  constructor: ApplicationConstructor,
  ...providerFactories: VertexFactory<any>[]
) => {
  try {
    installSourceMap();

    await context.initialize({ providerFactories: providerFactories });

    const application = new constructor();
    installTraps(application);
    if (application.start) {
      let options: any;
      if (constructor.options) {
        options = yargsParser(process.argv.slice(2), constructor.options);
      }
      await application.start(options);
    }
  } catch (err) {
    console.error(err);
  }
};
