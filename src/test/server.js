
const request = require('supertest')
const server = require('../app');

module.exports = request(server.callback());