const
  libCommon = require('../lib').common,
  mongoose = require('mongoose');

require('./schema');

const connectMongo = (mongoConf) => {
  // Check whether username and password is necessary
  let user = ''
  if (mongoConf.username && mongoConf.password) {
    user = `${dbConf.username}:${dbConf.password}@`;
  }
  let uri = `mongodb://${user}${mongoConf.host}:${mongoConf.port || 27017}/${mongoConf.name}`;
  return mongoose.connect(uri)
}
const logger = require('../logger');

const connect = async (mongoConf) => {
  // While mongodb connect for the first time, if there is a failure,
  // mongodb will not connect again. So we should retry unless mongodb is ready.
  while (true) {
    try {
      await connectMongo(mongoConf);

      logger.setConnect(true);
      logger.info('mongo connected');

      break;
    } catch (err) {
      logger.error('mongo connect failed, retry 10 seconds later')
      await libCommon.sleep(10 * 1000);
    }
  }

  mongoose.connection.on('error', () => {
    mongoose.disconnect();
  })
}

module.exports = {
  connect
};