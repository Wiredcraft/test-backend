const { createHash } = require('crypto');
const hash = createHash('sha256');

module.exports = {
  md5Encrypto(str) {
    return hash.update(str).digest('hex').toUpperCase();
  }
};
