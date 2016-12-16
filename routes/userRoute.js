const
User = require('../models/User');

function list(params, callback) {
    callback({ message: 'not allowed' });
}

function get(params, callback) {
    if (params.id) {
        User
        .findOne({ _id: params.id })
        .exec(callback);
    }
}

function post(params, callback) {
    const user = new User(params);

    user
    .save(callback);

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
