const express = require('express');
const router = express.Router();
const passport = require('passport')

/* Login with google */
router.get('/auth', passport.authenticate('google', {
  scope: ['profile']
}))

/* callback route for google to redirect to */
router.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
  res.send('good work keep on hacking')
})

module.exports = router
