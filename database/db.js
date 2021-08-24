const mongoose = require('mongoose');
const DB_USER = 'haohaop';
const PASSWORD = encodeURIComponent('19960718');
const DB_URL = `mongodb://${DB_USER}:${PASSWORD}@/dataDb?authSource=admin`;

// connect MongoDB
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, function() {
  console.log('Mongoose connected');
});

// connected
mongoose.connection.on('connected', function() {
  console.log('Mongoose connection open to ' + DB_URL);
});

// error
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error:' + err);
});

// disconnected
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose connection disconnected');
});

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

module.exports = mongoose;
