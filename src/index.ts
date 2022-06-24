import 'reflect-metadata';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';

import { loadControllers } from './util/web';
import { ControllerClasses } from './controller';

export const app = new Koa();

app.use(bodyParser());

app.keys = ['some secret hurr'];

const CONFIG = {
  maxAge: 86400000,
  secure: false /** (boolean) secure cookie*/
};

app.use(session(CONFIG, app));

loadControllers(app, ControllerClasses);

if (process.env.NODE_ENV === 'production') {
  app.listen(3000, () => {
    console.log('started');
  });
}
