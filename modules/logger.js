function log(type, obj) {
    // console.log.apply(null, [((type || 'INFO').toUpperCase() + ':')].concat(obj));
}

function trace(...obj) {
    log('trace', obj);
}

function debug(...obj) {
    log('debug', obj);
}

function info(...obj) {
    log('info', obj);
}

function warning(...obj) {
    log('warning', obj);
}

function error(...obj) {
    log('error', obj);
}

function fatal(...obj) {
    log('fatal', obj);
}

module.exports = {
    trace,
    debug,
    info,
    warning,
    error,
    fatal
};
