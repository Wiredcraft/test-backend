const
  userRoutes = require('./user');

const applyRoutes = (app) => {
  userRoutes(app);
};

module.exports = applyRoutes;
