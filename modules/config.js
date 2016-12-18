const
nconf = require('nconf');

nconf
    .argv()
    .env({ whitelist: [
        'server:port',
        'db:host',
        'db:port',
        'db:name',
        'db:test',
        'db:login:user',
        'db:login:pass',
        'dateFormat'
    ] })
    .file('./config.json');

const config = nconf.get();

module.exports = config;
