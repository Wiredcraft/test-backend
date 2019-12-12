let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const ClientSchema = new Schema({
  name: {
    type: String
  },
  clientId: {
    type: String
  },
  clientSecret: {
    type: String
  }
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;

