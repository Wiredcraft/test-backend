const
User  = require('../models/User'),
utils = require('../modules/utils');



function list(params, callback) {
    callback({ message: 'not allowed' });
}

function get(params, callback) {
    if (params.id) {
        User
        .findOne({ _id: params.id })
        .exec(utils.send(callback));
    }
}

function post(params, callback) {
    if (Object.keys(params).length === 0) {
        callback({ message: 'request has no body' });
    } else {
        const user = new User(params);

        user.save(utils.send(callback, 201));
    }
}

function put() {

}

function remove() {

}

module.exports = {
    list,
    get,
    post,
    put,
    remove
};
