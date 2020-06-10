interface Parser {
  readonly index: string;
  tryParse(data: NodeJS.ProcessEnv): any;
}

export interface Env {
  nodeEnv: NodeEnv;
}

export enum NodeEnv {
  Test = 'test',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

class NodeEnvParser {
  static index = 'nodeEnv';

  static tryParse(data: NodeJS.ProcessEnv) {
    const key = 'NODE_ENV';
    const value = data[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is required`);
    }
    const validValues = Object.values<string>(NodeEnv);
    if (!validValues.includes(value)) {
      throw new Error(`Environment variable ${key} must be one of ${validValues}`);
    }
    return value;
  }
}

export const parseEnv = (data: NodeJS.ProcessEnv): Env => {
  const parsers: Parser[] = [NodeEnvParser];
  const result: any = {};
  for (const parser of parsers) {
    const output = parser.tryParse(data);
    Object.assign(result, {
      [parser.index]: output,
    });
  }
  return result;
};
