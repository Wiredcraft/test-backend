const
  mongoose = require('mongoose');

const syslogSchema = new mongoose.Schema({
  level: {
    type: Number,
    min: 0,
    max: 7
  },
  path: String,
  reqMethod: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE']
  },
  params: {
    type: String
  },
  statusCode: Number,
  message: String,
  ipAddr: String
}, {
  timestamps: { createdAt: 'createAt'}
})

syslogSchema.index({createAt: 1});

mongoose.model('syslog', syslogSchema);