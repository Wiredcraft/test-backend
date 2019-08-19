"use strict";
module.exports = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // we change this to our domain in the future
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Client, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
};
