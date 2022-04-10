import { Logger } from '@nestjs/common';

export const useLogger = (namespace: string | Object) => {
  const context =
    typeof namespace === 'string' ? namespace : namespace.constructor.name;
  return new Logger(context, { timestamp: true });
};
