import yargsParser from 'yargs-parser';
import * as commands from '../commands';
import * as providers from '../providers';
import { bootstrap, shutdown, context } from '../context';

interface BuildHeaderOptions {
  width?: number;
  symbol?: string;
}

const buildHeaderDefaultOptions = {
  width: 25,
  symbol: '-',
};

const buildHeader = (text: string, options: BuildHeaderOptions = buildHeaderDefaultOptions) => {
  const { width, symbol } = { ...buildHeaderDefaultOptions, ...options };
  if (text.length >= width) {
    return text;
  }
  const symbolWidth = width - text.length - 2;
  const leftWidth = Math.floor(symbolWidth / 2);
  const rightWidth = symbolWidth - leftWidth;
  const left = Array(leftWidth).fill(symbol).join('');
  const right = Array(rightWidth).fill(symbol).join('');
  return `${left} ${text} ${right}`;
};

const main = async () => {
  const commandInstances = new Map<string, commands.Command>();
  for (const ctor of Object.values(commands)) {
    const instance = new ctor();
    commandInstances.set(instance.name, instance);
  }
  context.logger.info(
    'Available commands:\n%s',
    JSON.stringify(Array.from(commandInstances.keys()), undefined, 2)
  );

  const commandName = process.argv[2];
  const commandInstance = commandInstances.get(commandName);
  let isCommandOk = true;
  if (commandInstance) {
    try {
      // Expected layout of process.argv as follows:
      // [0]: node
      // [1]: script path
      // [2]: command name
      // [3]...[n]: command args
      const args = yargsParser(process.argv.slice(3), commandInstance.options);
      context.logger.info(buildHeader('BEGIN COMMAND'));
      await commandInstance.run(args);
    } catch (err) {
      context.logger.error(err);
      isCommandOk = false;
    } finally {
      context.logger.info(buildHeader('END COMMAND'));
    }
  }
  await shutdown();
  if (!isCommandOk) {
    process.exit(1);
  }
};

providers.LoggerProvider.pretty = true;

bootstrap(
  main,
  providers.EnvProvider,
  providers.ConfigProvider,
  providers.LoggerProvider,
  providers.SequelizeProvider
);
