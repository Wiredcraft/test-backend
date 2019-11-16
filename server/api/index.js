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
  app.get('/user', jwtAuth);
  return app;
};
