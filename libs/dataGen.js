const log               = require('./log')(module);
const mongoose          = require('mongoose');
const Person            = require('../models/person');
const userData          = require('./user_data');
const Client            = require('../models/client');
const User              = require('../models/user');

let dev_conn_str = 'mongodb://localhost/wired_backend_dev';
let test_conn_str = 'mongodb://localhost/wired_backend_test';
mongoose.connect(dev_conn_str, {useNewUrlParser: true,
                            useUnifiedTopology: true,
                            useCreateIndex: true,
                            useFindAndModify: false,
                            keepAlive: true});

var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});

db.once('open', function callback () {
    log.info("Connected to DB!");
});

log.info("Loading people into the database to view....");
Person.deleteMany({}, function(err) {

    for(const datum of userData ) {
        var person = new Person( datum );
        person.save(function(err, person) {
            if(err) return log.error(err);
            else log.info(`New Person - ${person.name} : ${person.address}`);
        });
    }
});


log.info("Creating a client for OAuth....");
Client.deleteMany({}, function(err) {
    var client = new Client({ name: "OurService iOS client v1", clientId: "mobileV1", clientSecret:"abc123456" });
    client.save(function(err, client) {
        if(err) return log.error(err);
        else log.info(`New Client - ${client.clientId} : ${client.clientSecret}`);
    });
});

log.info("Creating a new authenticated user....");
User.deleteMany({}, function(err) {
    var user = new User({ username: "dolemite", password: "stickingittotheman" });
    user.save(function(err, user) {
        if(err) return log.error(err);
        else log.info(`New User - username: ${user.username} *  password: ${user.password}`);
    });
});

setTimeout(function() {
    mongoose.disconnect();
}, 3000);

