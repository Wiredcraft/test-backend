/* import the google strategy */
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./keys')
const User = require('../models/user')

/* the passport module */
module.exports = (passport) => {
  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  // deserialize user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
  // Configure the strategy
  passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/api/auth/google/redirect'
  }, (accToken, refreToken, profile, done) => {
    // check if the user already exists
    User.findOne({googleId: profile.id}, (err, user) => {
      if (err) {
        console.log('first error: ', err)
        return done(err)
      }
      if (user) {
        console.log('second error: ', user)
        return done(null, user)
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
