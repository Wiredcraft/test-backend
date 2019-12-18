const passport   = require('passport');
const log        = require('../libs/log')(module);
const User      = require('../models/user');
module.exports = { 
    login: (req, res, next) => {
        passport.authenticate('local-login', {
        successRedirect : '/users/list', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    });
/*
        return passport.authenticate('local',
                              { session: true },
                              (err, passportUser, info) => {
                                  if (err) {
                                      log.error(err);
                                      return next(err);
                                  }

                                  if (passportUser) {
                                      const user = passportUser;
                                      user.token = passportUser.generateJWT();
                                      return res.json({ user: user.toAuthJSON() });
                                  }

                                  return res.status(400).info;
                              })(req, res, next);
*/
    },
    register: (req, res, next) => {
        passport.authenticate('local-signup', {
        successRedirect : '/users/list', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    });

/*
        var user = new User({ email: req.body.username, password: req.body.password });
        // save in Mongo
        user.save()
             .then((user) => {
                 //console.log('worker: ' + user.username + " saved.");  
                 req.login(user)
                    .then(() => {
                        return res.redirect('/user/list');
                    })
                    .catch(err => {
                        log.error(err)
                    });
             })
             .catch((err) => {
                 console.log(err);
             });
 */
    },

 }
