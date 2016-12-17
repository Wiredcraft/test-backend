// TODO: this just a fake logger
let active = true;

function activate() {
    active = true;
}

function deactivate() {
    active = false;
}

function log(type, obj) {
    if (active) {
        console.log.apply(null, [((type || 'INFO').toUpperCase() + ':')].concat(obj));
    }
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
    activate,
    deactivate,

    trace,
    debug,
    info,
    warning,
    error,
    fatal
};
