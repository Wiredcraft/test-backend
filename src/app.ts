import Koa from 'koa';
import body from 'koa-bodyparser';
import logger from 'koa-logger';
import session from 'koa-generic-session';
import redisStore from 'koa-redis';
import config from './config';
import { err } from './middlewares/err';
import router from './routes';
const app = new Koa();
app.use(logger())
app.use(err);
app.use(body());
app.keys = ['somekey'];

app.use(session({
  prefix: 'wired:sess',
  cookie: {
    maxAge: 1 * 60 * 60 * 1000,
    path: '/',
  },
  store: redisStore({
    host: config.REDIS.host,
    port: +config.REDIS.port
  }) as any
}))

router(app)

export = app;