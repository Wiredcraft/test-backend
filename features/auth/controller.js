"use strict";
var debugEnabled = require("../../config").debug;
var log = require("color-logs")(debugEnabled, debugEnabled, __filename);

var jwt = require("jsonwebtoken");
var User = require('../users/model');
var baseApi = require("../../api");

class AuthenticationApi extends baseApi {

  createJwt(payload, expiration) { // 86400 = 24 hours expires
    let jwtSecret = require("../../config").jwtSecret;
    log.info("jwt", jwtSecret);
    if(expiration) {
      return jwt.sign(payload, jwtSecret, { expiresIn: expiration });
    } else {
      return jwt.sign(payload, jwtSecret);
    }
  }

  // authentication routes:
  async access (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;

    log.info("email: ", email);

    try {
      let user = await User.findOne({ email: email }, "+password");
      log.info("user", user);
      if (!user) {
        return this.fail(res, 401, "User not found!");
      }

      let valid = await user.checkPassword(password);
      if (!valid) {
        return this.fail(res, 301, "Password does not match");
      }

      log.info("valid: ", valid);

      let expiration = 86400;
      let token = this.createJwt({
        user: user.email,
        user_id: user.id,
      }, expiration);
      return this.success(res, {
        token: token,
        expires: Math.floor(Date.now() / 1000) + (86400)
      });

    } catch(ex) {
      return this.exception(res, ex);
    }
  }

  token (req, res, next) {
    let data = this.getToken(req);
    return this.success(res, data);
  }

}

module.exports = new AuthenticationApi();
