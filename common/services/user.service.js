"use strict";

const loopback = require("loopback");
const logger = require("../utils/logger.js");
const moment = require("moment");

const objectType = "user";

exports.updateById = async (id, name, dob, address, description) => {
  try {
    logger.debug(
      `In User.updateById, input id: ${id}, name: ${name}, dob: ${dob}, address: ${address}, description: ${description}.`
    );
    const noInforMsg = "No information input, no change.";
    const noUserForIdMsg = `No user found for input id: ${id}.`;
    const noInforChangedMsg =
      "The input information are the same as in DB, no change.";
    let result = {};

    //check if no need update db.
    if (
      typeof name === "undefined" &&
      typeof dob === "undefined" &&
      typeof address === "undefined" &&
      typeof description === "undefined"
    ) {
      result.statusCode = 400;
      result.message = noInforMsg;
      return result;
    }

    let inputLength = 0;
    if (typeof name !== "undefined") inputLength += name.trim().length;
    if (typeof dob !== "undefined") inputLength += dob.toString().trim().length;
    if (typeof address !== "undefined") inputLength += address.trim().length;
    if (typeof description !== "undefined")
      inputLength += description.trim().length;
    if (inputLength == 0) {
      result.statusCode = 400;
      result.message = noInforMsg;
      return result;
    }

    let user = await loopback.findModel(objectType).findById(id);
    if (!user) {
      result.statusCode = 404;
      result.message = noUserForIdMsg;
      return result;
    }
    let updateValues = {};
    if (user.name != name) {
      updateValues.name = name;
    }
    if (!moment(user.dob).isSame(dob, "day")) {
      updateValues.dob = dob;
    }
    if (user.address != address) {
      updateValues.address = address;
    }
    if (user.description != description) {
      updateValues.description = description;
    }
    if (JSON.stringify(updateValues) === "{}") {
      result.statusCode = 400;
      result.message = noInforChangedMsg;
      return result;
    }
    //End check if no need update db.
    return await user.updateAttributes(updateValues);
  } catch (err) {
    return Promise.reject(err);
  }
};

exports.getById = async (id) => {
  try {
    let result = await loopback.findModel(objectType).findById(id);
    if (!result) {
      result = { statusCode: 404, message: "Not Found" };
    }
    return result;
  } catch (err) {
    return Promise.reject(err);
  }
};

exports.getAll = async () => {
  try {
    let result = {};
    let users = await loopback.findModel(objectType).find();
    result.size = users.length;
    result.data = users;
    return result;
  } catch (err) {
    return Promise.reject(err);
  }
};

exports.createUser = async (name, dob, address, description) => {
  try {
    logger.debug(
      `In User.createUser, input name: ${name}, dob: ${dob}, address: ${address}, description: ${description}.`
    );
    let userObj = {};
    userObj.name = name;
    userObj.dob = dob;
    userObj.address = address;
    userObj.description = description;
    return await loopback.findModel(objectType).create(userObj);
  } catch (err) {
    return Promise.reject(err);
  }
};

exports.deleteById = async (id) => {
  try {
    logger.debug(`In User.deleteById, input id: ${id}.`);
    //TODO: verification if need
    // let user = await loopback.findModel(objectType).findById(id);
    return await loopback.findModel(objectType).destroyById(id);
  } catch (err) {
    return Promise.reject(err);
  }
};
