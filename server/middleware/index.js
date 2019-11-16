const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  let authorization = req.header('authorization');
  let token = '';
  if (authorization) {
    authorization = authorization.split(' ');
    if (authorization.lenght !== 2 || authorization[0] !== 'Bearer') {
      token = '';
    } else {
      token = authorization[1];
    }
  }

  if (!token) {
    return next();
  }

  try {
    const user = jwt.verify(token, config.jwt.key);
    if (!user) {
      return next();
    }

    if (new Date() / 1000 - user.iat > config.jwt.ttl) { // token expired
      return next();
    }

    if (req.path !== '/login') {
      return res.status(401).json({
        message: 'permission deny',
        code: 11401
      });
    }

    req.session = user;
    req.token = token;
    next();
  } catch (err) {
    return res.status(403).json({
      message: 'Illegal Token',
      code: 10000
    });
  }
};
