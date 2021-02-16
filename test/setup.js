/* eslint-disable global-require */
const server = require('../server');

// Starting server
before(async () => {
  await server.init();
});

after(async () => {
  await server.shutdown();
});
