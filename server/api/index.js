const user = require('./user');
const auth = require('./auth');
const User = require('../models/user');
const friend = require('./friend');

const jwtAuth = async function(req, res, next) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      message: 'permission deny',
      code: 123
    });
  }

  const record = await User.findOne({ name: user.username });
  if (!record || record.status === -1) {
    return res.status(401).json({
      message: 'illegal user',
      code: 123
    });
  }

  next();
};

module.exports = app => {
  app.post('/signup', auth.signUp);
  app.post('/signin', auth.signIn);
  app.get('/users', jwtAuth, user.users);
  app.get('/users/:userId', jwtAuth, user.profile);
  app.put('/users/:userId', jwtAuth, user.update);
  app.delete('/users/:userId', jwtAuth, user.remove);
  app.post('/friends', jwtAuth, friend.add);
  app.get('/friends/:username', jwtAuth, friend.friends);

  return app;
};
