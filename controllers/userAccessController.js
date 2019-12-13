const User = require('../models/user')


module.exports = {
    registerUser: (req, res) => {
        var user = new User({
            username: req.body.username,
            password: req.body.password
        });

        user.save()
             .then(() => {
                 res.json({message: "New user has joined the hive" });
             })
             .catch(err => {
                 res.send(err);
             });
    },

    getUsers: (req, res) => {
        User.find()
             .then(users => {
                 res.json(users);
             })
             .catch(err => {
                 res.json(err);
             })
    }
}
