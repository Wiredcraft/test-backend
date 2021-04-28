const http = require('http');
const app = require('./app');

const config = require('./configs/config');

const { app: { port } } = config;

const server = http.createServer(app);

server.listen(port);

// for test usage
module.exports = server;