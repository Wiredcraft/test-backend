const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const app = express();

// Databse connection
require('./app/db/db').connect(config.database.connectionString);

// secret key
process.env.secret_key = config.secret;

// parse application/json
app.use(bodyParser.json());

// logging
app.use(morgan('dev'));

// Routes
app.use('/api/v1', require('./app/api/v1/user'));

// start server
app.listen(PORT);
