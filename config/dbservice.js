
const config                = require('./config');
const MongoClient           = require('mongodb').MongoClient;
const mongoose              = require('mongoose')


/**
 * This modeule is currently used for testing purposes and it creates a database connection
 * TODO: Use this function in the main app file (btapp.js)
 *
 **/
var connection = null;

module.exports.connect = () => {
    var db_host = config.db.host;
    var db_port = config.db.port;
    var db_name = config.db.name;

    var conn_str = `mongodb://${db_host}:${db_port}/${db_name}`;

    console.log('Creating connection');
    connection = mongoose.connect(conn_str, {useNewUrlParser: true,
                                             useUnifiedTopology: true,
                                             useCreateIndex: true,
                                             useFindAndModify: false,
                                             keepAlive: true});
    return connection;
}


module.exports.get = () => {
    if(!connection) {
        throw new Error('Call connect first');
    }
    return connection
}
