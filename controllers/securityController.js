const passport   = require('passport');
const log        = require('../libs/log')(module);
const User      = require('../models/user');
module.exports = { 
    signIn: (req, res, next) => {
        res.render('login');
    },

    login: (req, res, next) => {
        console.log("I am Groot.");
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
                                      console.log("We are here");
                                      return res.json({ user: user.toAuthJSON() });
                                  }

                                  return res.status(400).info;
                              })(req, res, next);
*/
    },
    register: (req, res, next) => {
        console.log("I am Groot.");
        passport.authenticate('local-signup', {
        successRedirect : '/users/list', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    });

/*
        var user = new User({ email: req.body.username, password: req.body.password });
        // save in Mongo
        user.save()
             .then((user) => {
                 console.log('worker: ' + user.username + " saved.");  
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

    enroll: (req, res, next) => {
        res.render('register');
    },

    goHome: (req, res, next) => {
        res.render('home');
    }
 }
