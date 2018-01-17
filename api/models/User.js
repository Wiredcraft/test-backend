/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      size: 24,
      required: true
    },
    address: {
      type: 'string',
      size: 50
    },
    description: {
      type: 'text',
      size: 140
    },
    dob: {
      type: 'date',
      defaultsTo: '1900-01-01'
    }
  }
};
