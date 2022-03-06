'use strict';

const path = require('path');

module.exports = app => {
  const directory = path.join(__dirname, 'app/validate');
  app.loader.loadToApp(directory, 'validate');
}