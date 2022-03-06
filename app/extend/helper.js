const CryptoJS = require('crypto-js');

module.exports = {
  md5Encrypto(str) {
    return CryptoJS.MD5(str).toString().toUpperCase();
  }
};
