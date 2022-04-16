const express = require('express');
const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const healthRouter = require('./router/health-router');
const userRouter = require('./router/user-router');
const { setReqLogger, errorHandler } = require('./service/middlewares');

// Generate the swagger UI.
if (JSON.parse(process.env.SWAGGER_ENABLED || 'false')) {
  log.info('Swagger is enabled.');
  require('./swagger')(app);
}

// enable nocache for restful APIs.
app.use(helmet({
  noCache: true,
}));

// Health checker
app.use(healthRouter);

const corsOption = {
  origin: true,
  credentials: true
};
app.use(cors(corsOption));
app.options('*', cors(corsOption));

app.use(cookieParser())
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.json({ type: [ 'application/json', 'application/*+json' ] }));

// request logger
app.use(setReqLogger());

// main routers
app.use('/user', userRouter);

// error handler
app.use(errorHandler());

module.exports = app
