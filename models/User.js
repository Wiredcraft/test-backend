const
moment   = require('moment'),
mongoose = require('mongoose'),
Schema   = mongoose.Schema;

const userSchema  = new Schema({
    name: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: false,
        validate: {
            validator: str => moment(str, 'DD/MM/YYYY', true).isValid()
        }
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
        set: val => this.securedField
    }
});

module.exports = mongoose.model('User', userSchema, 'Users');
