import Koa from 'koa';
import body from 'koa-bodyparser';
import logger from 'koa-logger';
import { err } from './middlewares/err';
import router from './routes';
const app = new Koa();
app.use(logger())
app.use(err);
app.use(body());
router(app)

export = app;