import { forward } from 'forwardit';
import { Env, parseEnv } from '../libraries';

declare module './utils' {
  interface Forwards extends Pick<EnvProvider, 'env'> {}
}

export class EnvProvider {
  @forward
  readonly env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  static async create() {
    const env = parseEnv(process.env);
    return new EnvProvider(env);
  }

  static async destroy() {}
}
