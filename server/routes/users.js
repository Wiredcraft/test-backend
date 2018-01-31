const express = require('express');
const router = express.Router();
const passport = require('passport')

/* Login with google */
router.get('/api/auth', passport.authenticate('google', {
  scope: ['profile']
}))

/* Logout user */
router.get('/api/auth/logout', (req, res) => {
  // logout with passport
  req.logout()
})

/* callback route for google to redirect to */
router.get('/api/auth/google/redirect', passport.authenticate('google'), (req, res) => {
  res.status(200).send({message: 'good work keep on hacking'})
})

module.exports = router
