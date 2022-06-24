import 'reflect-metadata';
import assert from 'assert';
import { debuglog } from 'util';
import Koa from 'koa';
import Router from '@koa/router';
import { getInstanceByClass } from './container';

const debug = debuglog('WebLoading');

const MIDDLEWARE_KEY = Symbol();
const GUARD_KEY = Symbol();
const CONTROLLER_KEY = Symbol();
const METHOD_KEY = Symbol();

interface MethodMeta {
  path: string;
  method: string[];
  propertyName: string;
}

interface GuardMeta {
  [key: string]: {
    middlewareClasses: any[];
  };
}

/**
 * Load middlewares
 *
 * @param app current koa app
 * @param classes controllers' classes to be load
 */
export function loadMiddlewares(app: Koa, classes: any[]) {
  for (const MiddlewareClass of classes) {
    const clsName = MiddlewareClass.name;
    debug(`Load middleware ${clsName}`);

    const middleware = getInstanceByClass(MiddlewareClass);
    const fn = initMiddleware(app, middleware, clsName);
    app.use(fn);
  }
}

/**
 * Load controllers
 *
 * @param app current koa app
 * @param classes controllers' classes to be load
 */
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

    // Load methods (@Get, @Post, @Put etc...)
    const list: MethodMeta[] =
      Reflect.getMetadata(METHOD_KEY, controller) ?? [];
    const map: GuardMeta = Reflect.getMetadata(GUARD_KEY, controller) ?? {};
    for (const { path, method, propertyName } of list) {
      const entirePath = data.prefix + path;
      debug(
        `Load controller [${method}] ${entirePath} ${clsName}#${propertyName}`
      );

      const middlewares: Router.Middleware[] = [];

      // Load guard middleware
      map[propertyName]?.middlewareClasses.forEach((Cls) => {
        const ins = getInstanceByClass(Cls);
        const fn = initMiddleware(app, ins, Cls.name);
        middlewares.push(fn);
        debug(
          `Load controller [${method}] ${entirePath} ${clsName}#${propertyName} Guard middleware ${Cls.name}`
        );
      });
      middlewares.push(controller[propertyName].bind(controller));

      // Register router
      router.register(entirePath, method, middlewares);
    }
  }

  app.use(router.routes()).use(router.allowedMethods());
}

/**
 * Mark as middleware (global)
 *
 * @returns
 */
export function Middleware() {
  return (targetCls: any, propertyName: string) => {
    Reflect.defineMetadata(MIDDLEWARE_KEY, { propertyName }, targetCls);
  };
}

/**
 * Mark as Guard (scoped middleware)
 *
 * @param middlewareClass
 * @returns
 */
export function Guard(middlewareClass: any) {
  return (object: any, propertyName: string) => {
    const map: GuardMeta = Reflect.getMetadata(GUARD_KEY, object) ?? {};
    if (map[propertyName]) {
      map[propertyName].middlewareClasses.push(middlewareClass);
    } else {
      map[propertyName] = {
        middlewareClasses: [middlewareClass]
      };
    }
    Reflect.defineMetadata(GUARD_KEY, map, object);
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
  return (object: any, propertyName: string) => {
    const list: MethodMeta[] = Reflect.getMetadata(METHOD_KEY, object) ?? [];
    list.push({ path, method, propertyName });
    Reflect.defineMetadata(METHOD_KEY, list, object);
  };
}

function initMiddleware(app: Koa, middleware: any, key: string) {
  const metadata = Reflect.getMetadata(MIDDLEWARE_KEY, middleware);
  assert(
    metadata?.propertyName,
    `Middleware not found within ${key}, please use @Middleware() to specify`
  );

  const { propertyName } = metadata;
  return middleware[propertyName].call(middleware, app);
}
