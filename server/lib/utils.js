const crypto = require('crypto');

module.exports = {
  md5(text) {
    const hash = crypto.createHash('md5');
    hash.update(text);
    return hash.digest('hex');
  },
  sha1(text) {
    return crypto.createHash('sha1').update(text).digest('hex');
  }
};
