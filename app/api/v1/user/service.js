const jwt = require('../../../utils/jwt');

// Expose User model
const User = require('../../../models/user');

const passwordStars = 'xxxxxxxxxxxx';

module.exports = {
  validatePassword(user, password, res) {
    user.isValidPassword(password).then((isValid) => {
      if (isValid) {
        // generate api token that will be expired in 24 hours
        const token = jwt.generate({ username: user.name });
        res.json({
          success: true,
          _id: user._id,
          token,
        });
      } else {
        res.json({ success: false, message: 'Wrong password' });
      }
    }).catch((e) => {
      console.error(e);
      res.status(500).json({ success: false, message: 'something went wrong' });
    });
  },
  verifyToken(res, token, next) {
    jwt.verify(token, (err, userPayload) => {
      if (err || userPayload === undefined) {
        res.status(401).json({ success: false, message: 'invalid token' });
      } else {
        // valid token
        User.findOne({
          name: userPayload.username,
        }, (userError, user) => {
          if (userError) throw userError;
          if (!user) {
            res.status(401).json({ success: false, message: 'invalid token' });
          } else {
            next();
          }
        });
      }
    });
  },
  removePassword(res) {
    if (Array.isArray(res.locals.bundle)) {
      res.locals.bundle = res.locals.bundle.map((user) => {
        user.password = `${passwordStars}`;
        return user;
      });
    } else {
      res.locals.bundle.password = `${passwordStars}`;
    }
    return res;
  },
};
