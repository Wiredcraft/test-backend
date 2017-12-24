const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('config');

const PORT = process.env.PORT || 3000;
const app = express();

// Databse connection
require('./app/db/db').connect(config.get('database.connectionString'));

// parse application/json
app.use(bodyParser.json());

// logging
app.use(morgan('dev'));

// Routes
app.use('/api/v1', require('./app/api/v1/user'));

// start server
app.listen(PORT);
