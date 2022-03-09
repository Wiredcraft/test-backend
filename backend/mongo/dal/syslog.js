const
  _ = require('lodash'),
  mongoose = require('mongoose'),
  syslogModel = mongoose.model('syslog');

const create = async (params, cb) => {
  let query = _.pick(params, ['level', 'path', 'reqMethod', 'params', 'statusCode', 'message', 'ipAddr']);
  return syslogModel.create(query, cb);
}

module.exports = {
  create
};