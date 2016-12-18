const
mongoose = require('mongoose'),
Schema   = mongoose.Schema;

// {
//   "id": "xxx",                  // user id(you can use uuid or the id provided by database, but need to be unique)
//   "name": "test",               // user name
//   "dob": "",                    // date of birth
//   "address": "",                // user address
//   "description": "",            // user description
//   "created_at": ""              // user created date
// }


const userSchema  = new Schema({
    name: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
        set: function (val) { return this.securedField; }
    }
});

module.exports = mongoose.model('User', userSchema, 'Users');
