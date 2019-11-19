const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = {
  jwt: (req, res, next) => {
    let authorization = req.header('authorization');
    let token = '';
    if (authorization) {
      authorization = authorization.split(' ');
      if (authorization.length !== 2 || authorization[0] !== 'Bearer') {
        token = '';
      } else {
        token = authorization[1];
      }
    }

    if (!token) {
      return next();
    }

    try {
      const options = config.get('jwt.options');
      const result = jwt.verify(token, config.get('jwt.secret'), options);
      const user = result.data;
      // token expired
      if (Date.now() / 1000 > result.iat + user.ttl) {
        return next();
      }

      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      return res.status(403).json({
        message: 'Illegal Token',
        code: 10000
      });
    }
  },
  pagination(req, res, next) {
    if (req.query.page) {
      const page = Math.abs(req.query.page) || 1;
      req.query.page = page;
    }

    if (req.query.pageSize) {
      const pageSize = Math.abs(req.query.pageSize);
      // pageSize must gt 0 and lt 10000
      if (!pageSize || pageSize > 10000) {
        req.query.pageSize = 0;
      } else {
        req.query.pageSize = Math.floor(pageSize);
      }
    }

    next();
  }
};
