const Koa = require('koa');
const config = require('config');
const bodyParser = require('koa-bodyparser');

const { logger, mongo } = require('./lib');
const {
  logHandler, formatHandler, errorHandler, contextHandler,
} = require('./middleware');
const router = require('./router');

const app = new Koa();

const shutdown = () => {
  mongo.shutdown();
  process.exitCode = 1;
}

module.exports.init = async () => {
  logger.info('init test-backend server');

  // init service
  await mongo.init();

  // register router
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

module.exports.shutdown = async () => {
  process.exitCode = 1;
};
