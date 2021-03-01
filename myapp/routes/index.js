module.exports = function (app) {
  // Routes for home page, basically to show a list of available apis.
  app.get('/', (req, res) => {
    res.json(require('../constants/apis'));
  });

  // Routes for user api.
  app.use('/users', require('./users'));
};
