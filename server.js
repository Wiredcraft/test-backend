const Koa = require('koa');
const config = require('config');
const bodyParser = require('koa-bodyparser');

const { logger, mongo } = require('./lib');
const {
  logHandler, formatHandler, errorHandler, contextHandler,
} = require('./middleware');
const router = require('./router');

const app = new Koa();

const shutdown = async () => {
  mongo.shutdown();
}

const init = async () => {
  logger.info('init server');

  // init service
  await mongo.init();

  // register service
  app.use(contextHandler);
  app.use(errorHandler);
  app.use(logHandler);
  app.use(formatHandler);
  app.use(bodyParser());
  router.register(app);

  app.listen(config.get('listen_port'));

  // exit process gracefully
  process.on('SIGTERM', shutdown);
  process.on('uncaughtException', shutdown);
};

init();
