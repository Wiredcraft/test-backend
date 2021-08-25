const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./routes/user');
const fs = require('fs');
const FileStreamRotator = require('file-stream-rotator');
const morgan = require('morgan');
app.mongoose = require('./database/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const logDirectory = __dirname + '/log';

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Output log to log folder
const accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYY-MM-DD',
  filename: logDirectory + '/%DATE%.log',
  frequency: 'daily',
  verbose: false,
});

app.use('/', express.static('public'));
app.use('/api/user', user);

// Custom log format
app.use(morgan((tokens, req, res) => {
  const log = {
    'method': tokens.method(req, res),
    'url': tokens.url(req, res),
    'status': tokens.status(req, res),
    'req': req.body,
    'response-time': tokens['response-time'](req, res) + 'ms',
  };
  return JSON.stringify(log);
}, {stream: accessLogStream}));

app.listen(3000, () => {
  console.log('app listening on port 3000');
});

module.exports = app;
