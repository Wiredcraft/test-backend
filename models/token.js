let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Access token
const AccessTokenSchema = new Schema({
    droneId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

var AccessToken = mongoose.model('AccessToken', AccessTokenSchema);

// Refresh token

const RefreshTokenSchema = new Schema({
    droneId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

var RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

module.exports = AccessToken;
module.exports = RefreshToken;

