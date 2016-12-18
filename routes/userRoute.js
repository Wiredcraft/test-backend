const
_     = require('lodash'),
User  = require('../models/User'),
utils = require('../modules/utils');

function list(params, callback) {
    callback({ message: 'not allowed' });
}

function get(params, callback) {
    if (params.id) {
        User.findOne({ _id: params.id }, utils.send(callback));
    } else {
        utils.send(callback);
    }
}

function post(params, callback) {
    if (Object.keys(params).length === 0) {
        callback({ message: 'request has no body' });
    } else {
        const user = new User(params);

        user.save(utils.send(callback, { status: 201, location: '/user/' + user._id.toHexString() }));
    }
}

function put(params, callback) {
    if (params.id) {
        User.update({ _id: params.id }, _.omit(params, 'id'), utils.send(callback, { status: 204 }));
    } else {
        callback({ message: 'no id specified' });
    }
}

function remove(params, callback) {
    if (params.id) {
        User.remove({ _id: params.id }, utils.send(callback, { status: 204 }));
    } else {
        callback({ message: 'no id specified' });
    }
}

module.exports = {
    list,
    get,
    post,
    put,
    remove
};
