const log               = require('./log')(module);
const mongoose          = require('mongoose');
const Person            = require('../models/person');
const userData          = require('./test_user_data');
const Client            = require('../models/client');
const User              = require('../models/user');

let test_conn_str = 'mongodb://localhost/wired_backend_test';
mongoose.connect(test_conn_str, {useNewUrlParser: true,
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
            else log.info(`New Person - ${person.name} : ${person.address} : ${person.position}`);
        });
    }
});

setTimeout(function() {
    mongoose.disconnect();
}, 3000);

