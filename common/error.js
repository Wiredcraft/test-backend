const { HttpError } = require('restify-errors');

const code = {
  default: 1,
  http: 2,
  mongo: 3,
}

class MongoError extends Error {
  static get code() {
    return code.mongo;
  }
}

module.exports = {
  MongoError, HttpError, code,
};
