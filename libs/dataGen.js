const log               = require('./log')(module);
const mongoose          = require('mongoose');
const Person            = require('../models/person');
const userData          = require('./user_data');
const Client            = require('../models/client');

let conn_str = 'mongodb://localhost/wired_backend_dev';
mongoose.connect(conn_str, {useNewUrlParser: true,
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

Person.deleteMany({}, function(err) {

    for(const datum of userData ) {
        var person = new Person( datum );
        person.save(function(err, person) {
            if(err) return log.error(err);
            else log.info("New Person - %s:%s",person.name,person.address);
        });
    }
});

Client.remove({}, function(err) {
    var client = new Client({ name: "OurService iOS client v1", clientId: "mobileV1", clientSecret:"abc123456" });
    client.save(function(err, client) {
        if(err) return log.error(err);
        else log.info("New client - %s:%s",client.clientId,client.clientSecret);
    });
});

setTimeout(function() {
    mongoose.disconnect();
}, 3000);
