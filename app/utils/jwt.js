const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = {
  generate(data) {
    return jwt.sign(data, config.get('secret'), {
      expiresIn: '24h',
    });
  },
  verify(token, next) {
    jwt.verify(token, config.get('secret'), (err, userPayload) => {
      next(err, userPayload);
    });
  },
};
