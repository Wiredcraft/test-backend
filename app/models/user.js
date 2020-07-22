const generateModel = require('./base')
const moment = require('moment')

const DATE_FORMAT = 'YYYY-MM-DD'

const User = generateModel('user', {
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return moment(v, DATE_FORMAT, true).isValid()
      },
      message: props => `${props.value} is not a valid data format (${DATE_FORMAT})`
    }
  },
  address: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

module.exports = User
