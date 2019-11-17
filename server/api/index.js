const user = require('./user');
const auth = require('./auth');

const jwtAuth = (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      message: 'permission deny',
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

  return app;
};
