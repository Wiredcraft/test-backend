const
  redis = require('redis'),
  logger = require('../logger');

let client = null;

const createClient = async (redisConf) => {
  client = redis.createClient({host: redisConf.host, port: redisConf.port});

  if (redisConf.password) {
    client.auth(redisConf.password, (err) => {
      if (err) {
        logger.error('err');
      }
    })
  }

  client.on('error', (err) => {
    logger.error("redis connect failed:" + err);
  })

  await client.connect();

  logger.info("redis connected");

  return client;
}

const getClient = () => {
  return client;
};

module.exports = {
  createClient,
  getClient
};