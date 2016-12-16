const _    = require('lodash');

function prepareDbObjectForClient(obj) {
    const id = obj._id.toHexString();

    return _(obj)
        .omit('_id', '__v')
        .assign({ id: id })
        .value();
}

function sendResponse(callback, status) {
    return (err, result) => {
        if (err) {
            callback(err, 500);
            return;
        }

        if (typeof result.toObject !== 'function') {
            callback(err, status);
            return;
        }

        let clientResult = result.toObject();

        if (_.isArray(clientResult)) {
            clientResult = _.map(clientResult, prepareDbObjectForClient);
        } else {
            clientResult = prepareDbObjectForClient(clientResult);
        }

        callback(err, status, clientResult);
    };
}

module.exports = {
    send: sendResponse
};
