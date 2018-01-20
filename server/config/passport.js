/* import the google strategy */
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./keys')
const User = require('../models/user')

/* the passport module */
module.exports = (passport) => {
  // Configure the strategy
  passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/auth/google/redirect'
  }, (accToken, refreToken, profile, done) => {
    // check if the user already exists
    User.findOne({googleId: profile.id}, (err, user) => {
      if (err) {
        return done(err)
      }
      if (user) {
        return done(null, false, {
          message: 'User already exists'
        })
      } else {
        // if not save the user
        const newUser = User()
        newUser.username = profile.displayName
        newUser.googleId = profile.id
        newUser.save((err) => {
          if (err) {
            throw err
          }
          return done(null, newUser)
        })
      }
    })
  }))
}
