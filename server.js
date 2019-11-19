const http = require('http');
const config = require('config');
const logger = require('./server/lib/logger');
const app = require('./server/app');

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
