const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        required: [true, 'please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email']
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 20
    },
    passwordConfirm: {
        type: String,
        required: true,
        min: 6,
        max: 20
    },
    dob: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    token: {
        type: String
    },
}, 
{timestamps: true}

);

module.exports = mongoose.model('user', userSchema);