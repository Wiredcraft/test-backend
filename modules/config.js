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
        'db:login:pass'
    ] })
    .file('./config.json');

const config = nconf.get();

/**
 * @param  {Boolean=} use test server
 * @return {String}   the connection string to connect with mongo
 */
function getDbConnectionString(test) {
    const dbConfig = config.db || {};
    let uri = `mongodb://${dbConfig.host}:${dbConfig.port}/${test ? dbConfig.test : dbConfig.name}`;

    if (dbConfig.user && dbConfig.pass) {
        uri = `${dbConfig.user}:${dbConfig.pass}@` + uri;
    }

    return uri;
}

module.exports = config;
module.exports.getDbConnectionString = getDbConnectionString;
