const logger = require('log4js').getLogger('RedisClient');
const { port, host } = require('config').get('User.dbConfig');
const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient(port, host);
client.on("error", (error) => { logger.error(error); });

exports.client = client;
exports.incr = promisify(client.incr).bind(client);
exports.watch = promisify(client.watch).bind(client);
exports.hgetall = promisify(client.hgetall).bind(client);
exports.del = promisify(client.del).bind(client);
exports.exists = promisify(client.exists).bind(client);
exports.zrange = promisify(client.zrange).bind(client);
exports.zscore = promisify(client.zscore).bind(client);
exports.multi = function (commands) {
  const multi = client.multi(commands);
  return promisify(multi.exec).call(multi);
};
exports.batch = function (commands) {
  const batch = client.batch(commands);
  return promisify(batch.exec).call(batch);
};
