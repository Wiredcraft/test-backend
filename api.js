"use strict";
var debugEnabled = require("./config").debug;
var log = require("color-logs")(debugEnabled, debugEnabled, __filename);

var jwt = require("jsonwebtoken");

class BaseApi {

  constructor() {
    this.req = null;
    this.res = null;
  }

  success(res, data) {
    if(!res) return;
    return res.status(200).send({
      success: true,
      data: data
    });
  }

  fail(res, code, message, data) {
    return res.status(200).send({
      success: false,
      code: code,
      message: message,
      data: data
    });
  }

  error(res, code, message) {
    return res.status(401).send({
      success: false,
      message: message
    });
  }
  exception(res, ex) {
    return res.status(500).send({
      success: false,
      data: ex
    });
  }

  permissionDenied(res) {
    return res.status(401).send("permission denied");
  }

  isAuthenticated(req, res, next) {
    let data = this.getToken(req, res);
    log.info("checking authentication of", data);
    if (data) {
      next();
    } else {
      return this.permissionDenied(res);
    }
  }

  getToken(req, res) {
    let jwtSecret = require("./config").jwtSecret
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if(!token) {
      this.permissionDenied(res);
    }

    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    if (token) {
      try {
        var decoded = jwt.verify(token, jwtSecret);
        return decoded;
      } catch(e) {
        log.error(e);
        if (e.name == "TokenExpiredError") {
          return this.fail(res, 4010, "Token Expired", {
            message: e.message,
            expiredAt: e.expiredAt
          });
        }
        log.error(e);
        return this.error(401, "Token is not valid");
      }
    } else {
      return this.permissionDenied();
    }
  }

}

module.exports = BaseApi;
