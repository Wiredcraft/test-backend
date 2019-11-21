const express = require('express');
const helmet = require('helmet');
const middleware = require('./middleware');
const logger = require('./lib/logger');
const router = require('./api');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../document/api.json');

const env = process.env.NODE_ENV;
const app = express();
app.use(helmet());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(middleware.jwt);
app.use(middleware.pagination);
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));
app.use(bodyParser.text({ limit: '5mb' }));
router(app);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Unexpected Error';
  res.status(err.status);
  const user = req.loginUser;
  const token = req.header('authorization');
  if (err.status >= 500) {
    const stack = err.stack;
    const detail = {
      name: err.name,
      method: req.method,
      url: req.url,
      token: token || '',
      user: user || ''
    };
    if (env === 'development') {
      detail.stack = stack;
    }

    logger.log('error', err.message, detail);
    res.status(err.status).json({
      message: 'Server Error',
      code: err.code || 10500
    });
  } else {
    res.status(err.status || 400).json({ message: err.message, code: err.code || 10400 });
  }
  next();
});

module.exports = app;
