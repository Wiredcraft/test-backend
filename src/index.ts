import 'reflect-metadata';
import Koa from 'koa';
import { ControllerClasses } from './controller';
import { MiddlewareClasses } from './middleware';
import { loadControllers, loadMiddlewares } from './util/web';

export const app = new Koa();

loadMiddlewares(app, MiddlewareClasses);
loadControllers(app, ControllerClasses);

if (process.env.NODE_ENV === 'production') {
  app.listen(3000, () => {
    console.log('started');
  });
}
