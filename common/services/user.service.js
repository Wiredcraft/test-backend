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
    const noUserForIdMsg = `No user found for input id: ${id}.`;
    const noInforChangedMsg = "No need to update DB.";
    let result = {};

    let user = await loopback.findModel(objectType).findById(id);
    if (!user) {
      result.statusCode = 404;
      result.message = noUserForIdMsg;
      return result;
    }

    //check if no need update db.
    let inputValues = {};
    if (
      typeof name !== "undefined" &&
      name.trim().length > 0 &&
      user.name != name
    )
      inputValues.name = name;
    if (
      typeof dob !== "undefined" &&
      dob.toString().trim().length > 0 &&
      !moment(user.dob).isSame(dob, "day")
    )
      inputValues.dob = dob;
    if (
      typeof address !== "undefined" &&
      address.trim().length > 0 &&
      user.address != address
    )
      inputValues.address = address;
    if (
      typeof description !== "undefined" &&
      description.trim().length > 0 &&
      user.description != description
    )
      inputValues.description = description;
    if (JSON.stringify(inputValues) === "{}") {
      result.statusCode = 400;
      result.message = noInforChangedMsg;
      return result;
    }
    //End check if no need update db.
    return await user.updateAttributes(inputValues);
  } catch (err) {
    logger.error(err);
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
    logger.error(err);
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
    logger.error(err);
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
    logger.error(err);
  }
};

exports.deleteById = async (id) => {
  try {
    logger.debug(`In User.deleteById, input id: ${id}.`);
    //TODO: verification if need
    // let user = await loopback.findModel(objectType).findById(id);
    return await loopback.findModel(objectType).destroyById(id);
  } catch (err) {
    logger.error(err);
  }
};
