'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  sequelize: {
    enable: true,
    package: 'egg-sequelize'
  },

  validate: {
    enable: true,
    package: 'egg-validate'
  },

  jwt: {
    enable: true,
    package: 'egg-jwt'
  }
};
