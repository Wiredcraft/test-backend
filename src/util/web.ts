import 'reflect-metadata';
import assert from 'assert';
import { debuglog } from 'util';
import Koa from 'koa';
import Router from '@koa/router';
import { getInstanceByClass } from './container';

const debug = debuglog('WebLoading');

const MIDDLEWARE_KEY = Symbol();
const CONTROLLER_KEY = Symbol();
const METHOD_KEY = Symbol();

export function loadMiddlewares(app: Koa, middlewares: any[]) {
  for (const MiddlewareClass of middlewares) {
    const clsName = MiddlewareClass.name;
    debug(`Load middleware ${clsName}`);

    const middleware = getInstanceByClass(MiddlewareClass);
    const metadata = Reflect.getMetadata(MIDDLEWARE_KEY, middleware);
    assert(
      metadata?.propertyName,
      `Middleware not found within ${clsName}, please use @Middleware() to specify`
    );

    const { propertyName } = metadata;
    const fn = middleware[propertyName].call(middleware, app);
    app.use(fn);
  }
}

export function loadControllers(app: Koa, classes: any[]) {
  const router = new Router();

  for (const ControllerClass of classes) {
    // Load metadata from class (set by @Controller)
    const clsName = ControllerClass.name;
    const data = Reflect.getMetadata(CONTROLLER_KEY, ControllerClass);
    assert(
      data,
      `Controller not defined within ${clsName}, please use @Controller('xxx') first`
    );

    const controller = getInstanceByClass(ControllerClass);

    // Load metadata from methods (@Get, @Post, @Put etc...)
    const list = Reflect.getMetadata(METHOD_KEY, controller) ?? [];
    for (const { path, method, key } of list) {
      const entirePath = data.prefix + path;
      debug(`Load controller [${method}] ${entirePath} ${clsName}#${key}`);

      // Register router
      router.register(entirePath, method, controller[key].bind(controller));
    }
  }

  app.use(router.routes()).use(router.allowedMethods());
}

/**
 * Mark as middleware
 *
 * @returns
 */
export function Middleware() {
  return (targetCls: any, propertyName: string) => {
    Reflect.defineMetadata(MIDDLEWARE_KEY, { propertyName }, targetCls);
  };
}

/**
 * Mark as controller
 *
 * @param prefix
 * @returns
 */
export function Controller(prefix: string) {
  return (targetCls: any) => {
    assert(
      prefix.startsWith('/'),
      `prefix path must start with '/', within ${targetCls.name}`
    );
    Reflect.defineMetadata(CONTROLLER_KEY, { prefix }, targetCls);
  };
}

/**
 *
 * @param path
 * @returns
 */
export function Get(path: string) {
  return webMethodDecorator(path, ['GET']);
}

/**
 *
 * @param path
 * @returns
 */
export function Post(path: string) {
  return webMethodDecorator(path, ['POST']);
}

/**
 *
 * @param path
 * @returns
 */
export function Put(path: string) {
  return webMethodDecorator(path, ['PUT']);
}

/**
 *
 * @param path
 * @returns
 */
export function Patch(path: string) {
  return webMethodDecorator(path, ['PATCH']);
}

/**
 *
 * @param path
 * @returns
 */
export function Delete(path: string) {
  return webMethodDecorator(path, ['DELETE']);
}

function webMethodDecorator(path: string, method: string[]) {
  assert(path.startsWith('/'), `path must start with '/'`);
  return (object: any, key: string) => {
    const list = Reflect.getMetadata(METHOD_KEY, object) ?? [];
    list.push({ path, method, key });
    Reflect.defineMetadata(METHOD_KEY, list, object);
  };
}
