import { Command } from './command';
import { context } from '../context';

export class ConfigDumpCommand implements Command {
  get name() {
    return 'config:dump';
  }

  get options() {
    return {};
  }

  async run() {
    const text = JSON.stringify(context.config, undefined, 2);
    context.logger.info(`The merged config is:\n${text}`);
  }
}
