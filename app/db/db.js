const mongoose = require('mongoose');

module.exports = {
  connect(connectionString) {
    mongoose.connect(connectionString, { useMongoClient: true });
    mongoose.Promise = global.Promise;
    return mongoose;
  },
};
