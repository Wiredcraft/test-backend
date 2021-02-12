import Koa from 'koa';
import body from 'koa-bodyparser';

const app = new Koa();

app.use(body());

export default app;