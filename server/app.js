const http = require('http');
const express = require('express');
const config = require('config');
const helmet = require('helmet');
const middleware = require('./middleware');
const logger = require('./lib/logger');
const router = require('./api');
const bodyParser = require('body-parser');

const env = process.env.NODE_ENV;
const app = express();
app.use(helmet());
app.use(middleware.jwt);
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
      stack: stack,
      token: token || '',
      user: user || ''
    };
    logger.log('error', err.message, detail);
    if (env === 'development') {
      throw err;
    } else {
      res.status(err.status).json({
        message: 'Server Error',
        code: err.code || 10500
      });
    }
  } else {
    res.status(err.status || 400).json({ message: err.message, code: err.code || 10400 });
  }
  next();
});
const server = http.createServer(app);
server.listen(config.port, config.host);
server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.log('error! listen address is in used~!');
    close();
  } else {
    logger.log('error', err.message, {
      stack: err.stack
    });
  }
});

server.on('listening', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('app listening at http://%s:%s', host, port);
});

process.on('uncaughtException', err => {
  logger.log(
    'error',
    'uncaughtException process will reload',
    err.message,
    err.stack
  );
  const killTimer = setTimeout(() => {
    process.exit(1);
  }, 3000);
  killTimer.unref();
  server.close();
});

process.on('SIGINT', close);
process.on('SIGTERM', close);

function close() {
  server.close(() => {
    process.exit();
  });
}
