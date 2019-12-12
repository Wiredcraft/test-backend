const log               = require('./log')(module);
const mongoose          = require('mongoose');
const Users             = require('../models/users');
const userData          = require('./user_data');


mongoose.connect('mongodb://localhost/wired_backend_dev');
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

Users.deleteMany({}, function(err) {

    for(const datum of userData ) {
        var users = new Users( datum );
        user.save(function(err, user) {
            if(err) return log.error(err);
            else log.info("New user - %s:%s",user.name,user.address);
        });
    }
});


setTimeout(function() {
    mongoose.disconnect();
}, 3000);
