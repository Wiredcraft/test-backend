const jwt = require('jsonwebtoken');
const pwd = require('pwd');
const config = require('config');
const User = require('../models/user');

module.exports = {
  async signIn(req, res, next) {
    try {
      const body = req.body || {};
      const username = body.username;
      const password = body.password;
      if (!username || !password) {
        return res.status(400).json({
          message: 'password and username required',
          code: 10400
        });
      }

      const user = await User.findOne({ name: username });
      if (!user || user.status === -1) {
        return res.status(400).json({
          message: 'user not found',
          code: 10404
        });
      }

      const result = await pwd.hash(String(password), user.salt);
      if (result.hash !== user.password) {
        return res.status(401).json({
          message: 'invalid password',
          code: 10401
        });
      }

      const authricated = {
        username: user.name,
        timestamp: parseInt(Date.now() / 1000),
        ttl: config.get('jwt.ttl'),
        is_admin: config.get('admin') === user.name
      };
      const token = jwt.sign({ data: authricated }, config.get('jwt.secret'), config.get('jwt.options'));

      res.json({
        message: 'ok',
        code: 0,
        data: {
          token: token,
          username: user.name
        }
      });
    } catch (err) {
      next(err);
    }
  },
  async signUp(req, res, next) {
    try {
      const body = req.body || {};
      const username = body.username;
      const password = body.password;
      const confirm = body.confirm;
      const address = body.address || '';
      const location = body.location;
      const description = body.description || '';
      const birthday = body.birthday;
      const passwd = String(password);
      if (!username || !password || passwd.length < 6) {
        return res.status(400).json({
          message: 'invalid username or password',
          code: 10400
        });
      }

      if (password !== confirm) {
        return res.status(400).json({
          message: 'input password and confirm must be consistent',
          code: 11400
        });
      }

      const exists = await User.findOne({ name: username });
      if (exists) {
        return res.status(400).json({
          message: 'user existed',
          code: 12400
        });
      }

      const user = {
        name: username,
        password: passwd,
        address: address,
        dob: birthday ? new Date(birthday) : null,
        createdAt: Date.now(),
        description
      };
      if (Array.isArray(location) && location.length === 2) {
        user.location = location;
      }

      await User.addUser(user);
      res.json({
        message: 'ok',
        code: 0
      });
    } catch (err) {
      next(err);
    }
  }
};
