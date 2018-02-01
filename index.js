const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const middlewares = require('./helpers/middlewares');
const config = require('./config');
const routes = require('./routes');

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride());
app.use(cors());

app.use(config.basePath, routes);

app.use(middlewares.convertToApiError);
app.use(middlewares.notFound);

app.use(middlewares.addTrace);

const querystring = config.mongo.host;

mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;

mongoose.connect(querystring, { useMongoClient: true })
  .then(({ db: { databaseName } }) => console.log(`Connected to Mongo server in ${databaseName}`)) // eslint-disable-line no-console
  .catch(() => Promise.reject(new Error(`Unable to connect to database: ${querystring}`)));

if (!module.parent) {
  app.listen(config.port, () => {
    console.info(`API started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}

module.exports = app;
