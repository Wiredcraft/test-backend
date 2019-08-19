"use strict";
var debugEnabled = require("../config").debug;
var log = require("color-logs")(debugEnabled, debugEnabled, __filename);

var jwt = require("jsonwebtoken");
var baseApi = require("../../api");

class AuthenticationApi extends baseApi {

  createJwt(payload, expiration) { // 86400 = 24 hours expires
    let jwtSecret = require("../config").jwtSecret;
    if(expiration) {
      return jwt.sign(payload, jwtSecret, { expiresIn: expiration });
    } else {
      return jwt.sign(payload, jwtSecret);
    }
  }

  // authentication routes:
  access (req, res, next) {
    let user = req.body.user;
    let password = req.body.password;
    let buckets = require("../buckets");

    this.req = req;
    this.res = res;

    log.debug("access: " + user);

    let userData = buckets[user];
    if(!userData) {
      log.error("invalid user:" + user);
      return this.error(res, 401, "user not found or invalid");
    }
    if(password != userData.password) {
      log.error("incorrect password for user:" + user);
      return this.fail(res, 400, "incorrect password");
    }
    let payload = {
      user: user,
      cluster: userData.cluster
    };

    let expiration = 86400;
    let token = this.createJwt(payload, expiration);
    return this.res.status(200).send({
      success: true,
      token: token,
      expires: Math.floor(Date.now() / 1000) + (86400)
    });
  }

  token (req, res, next) {
    console.info("token get");
    let data = this.getToken(req);
    console.info("got token", data);
    return this.success(res, data);
  }

}

module.exports = new AuthenticationApi();
