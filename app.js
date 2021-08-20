const express = require('express');
const app = express();
const userController = require('./controllers/user');
const bodyParser = require("body-parser")
require('./database/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// user route
app.route('/api/user')
  .get(userController.getUser)
  .put(userController.addUser);
app.route('/api/user/:id')
  .get(userController.getUser);

app.listen(3000, () => {
  console.log('app listening on port 3000');
});
