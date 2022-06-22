import crypto = require('crypto');

export function encodeWithSalt(text: string, salt: string) {
  return md5(text + salt);
}

function md5(string: string) {
  return crypto.createHash('md5').update(string).digest('hex');
}
