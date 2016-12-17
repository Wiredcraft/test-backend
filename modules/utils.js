const _ = require('lodash');

function prepareDbObjectForClient(obj) {
    const id = obj._id.toHexString();

    return _(obj)
        .omit('_id', '__v')
        .assign({ id: id })
        .value();
}

/**
 * @param  {Function}     callback
 * @param  {Object}       callback.err     error that will be send
 * @param  {Number}       callback.body    body that will be send
 * @param  {Object}       callback.options additional options
 * @param  {Object}       options          additional options that will be handled by server
 * @param  {Object}       options.status   status to send by server
 * @param  {Object}       options.location location to send by server
 */
function sendResponse(callback, options) {
    return (err, result) => {
        if (err) {
            callback(err, void 1, options);
            return;
        }

        if (!result || typeof result.toObject !== 'function') {
            callback(void 1, void 1, options);
            return;
        }

        let dataToSend = result.toObject();

        if (_.isArray(dataToSend)) {
            dataToSend = _.map(dataToSend, prepareDbObjectForClient);
        } else {
            dataToSend = prepareDbObjectForClient(dataToSend);
        }

        callback(err, { data: dataToSend }, options);
    };
}

module.exports = {
    send: sendResponse
};
