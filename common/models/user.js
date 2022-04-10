"use strict";
const UserService = require("../services/user.service");

module.exports = function (user) {
  user.updateById = async (id, name, dob, address, description) => {
    try {
      return await UserService.updateById(id, name, dob, address, description);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  user.remoteMethod("updateById", {
    description: "Update user by id.",
    accepts: [
      {
        arg: "id",
        type: "string",
        required: true,
        http: { source: "path" },
        description: "user id",
      },
      { arg: "name", type: "string", description: "user name" },
      {
        arg: "dob",
        type: "date",
        description: "date of birth",
      },
      {
        arg: "address",
        type: "string",
        description: "user address",
      },
      {
        arg: "description",
        type: "string",
        description: "user description",
      },
    ],
    returns: { arg: "result", type: "user", root: true },
    http: { path: "/:id", verb: "patch" },
  });

  user.getById = async (id) => {
    try {
      return await UserService.getById(id);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  user.remoteMethod("getById", {
    description: "Get user by id.",
    accepts: [
      {
        arg: "id",
        type: "string",
        required: true,
        http: { source: "path" },
        description: "user id",
      },
    ],
    returns: { arg: "result", type: "user", root: true },
    http: { path: "/:id", verb: "get" },
  });

  user.getAll = async () => {
    try {
      return await UserService.getAll();
    } catch (err) {
      return Promise.reject(err);
    }
  };
  user.remoteMethod("getAll", {
    description: "Get all users. Result format: {size: n, data: [user]}",
    accepts: [],
    returns: { arg: "result", type: "user", root: true },
    http: { path: "/", verb: "get" },
  });

  user.createUser = async (name, dob, address, description) => {
    try {
      return await UserService.createUser(name, dob, address, description);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  user.remoteMethod("createUser", {
    description: "Create new user.",
    accepts: [
      { arg: "name", type: "string", required: true, description: "user name" },
      {
        arg: "dob",
        type: "date",
        required: true,
        description: "date of birth",
      },
      {
        arg: "address",
        type: "string",
        required: true,
        description: "user address",
      },
      {
        arg: "description",
        type: "string",
        description: "user description",
      },
    ],
    returns: { arg: "result", type: "user", root: true },
    http: { path: "/", verb: "post" },
  });

  user.on("attached", function () {
    user.deleteById = async (id) => {
      try {
        return await UserService.deleteById(id);
      } catch (err) {
        return Promise.reject(err);
      }
    };
  });
};
