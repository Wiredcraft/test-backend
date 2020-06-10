import { dependencies } from 'dag-maker';
import { forward } from 'forwardit';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import deepmerge from 'deepmerge';
import { EnvProvider } from './env';
import { Config, NodeEnv } from '../libraries';

const deepMergeAll = <T>(objects: T[]) => {
  const arrayMerge = <K>(_target: unknown, source: K) => source;
  return deepmerge.all<T>(objects, { arrayMerge });
};

declare module './utils' {
  interface Forwards extends Pick<ConfigProvider, 'config'> {}
}

@dependencies({
  envProvider: EnvProvider,
})
export class ConfigProvider {
  @forward
  readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  static async create(options: { envProvider: EnvProvider }) {
    const { nodeEnv } = options.envProvider.env;
    const configStack: string[] = [];
    const configObjects: Config[] = [];
    const localConfigName = nodeEnv === NodeEnv.Test ? 'local.test' : 'local';
    const configNames = ['default', nodeEnv, localConfigName];
    for (const name of configNames) {
      const configPath = path.join('config', `config.${name}.yaml`);
      if (!fs.existsSync(configPath)) {
        continue;
      }
      configStack.push(configPath);
      const configContent = fs.readFileSync(configPath).toString('utf8');
      const configObject = yaml.parse(configContent) as Config;
      if (configObject) {
        configObjects.push(configObject);
      }
    }
    if (configStack.length < 1) {
      throw new Error('Config file not found');
    }
    const config = deepMergeAll(configObjects);
    return new ConfigProvider(config);
  }

  static async destroy() {}
}
