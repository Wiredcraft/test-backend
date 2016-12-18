const
_      = require('lodash'),
moment = require('moment'),
User   = require('../models/User'),
utils  = require('../modules/utils');

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
        if (params.dob) {
            const dob = moment(params.dob, ['DD/MM/YYYY', 'DD-MM-YYYY'], true);

            if (dob.isValid()) {
                params.dob = dob.format('DD/MM/YYYY');
            } else {
                callback({ message: 'dob should be in DD/MM/YYYY or DD-MM-YYYY format' });
                return;
            }
        }

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
