const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./routes/user');
require('./database/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/',express.static('public'))
app.use('/api/user', user);

app.listen(3000, () => {
  console.log('app listening on port 3000');
});
