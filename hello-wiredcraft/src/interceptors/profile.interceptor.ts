import {Interceptor} from '@loopback/context';

export const profile: Interceptor = async (invocationCtx, next) => {
  console.log(` Invoke => ${invocationCtx.methodName}`);
  const begin = Date.now();
  const result = await next();
  const end = Date.now();
  const time = end - begin;
  console.log(` Finish invoke ${invocationCtx.methodName} cost: ${time}`);
  return result;
};
