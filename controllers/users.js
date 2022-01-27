import { User } from "../models/user.js";

let users = [];

export const getUsers = (req, res) => {
  User.find({}, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.error(err);
    }
  });
};

export const getUser = (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.error(err);
    }
  });
};

export const createUser = (req, res) => {
  const user = new User({
    ...req.body,
    createdAt: Date.now(),
  });

  user.save((err, data) => {
    res.status(200).json({
      code: 200,
      message: "User added successfully",
      createdUser: data,
    });
  });
};

export const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true },
    (err, data) => {
      if (!err) {
        res.status(200).json({
          code: 200,
          message: "User updated successfully.",
          updatedUser: data,
        });
      } else {
        console.error(err);
      }
    }
  );
};

export const deleteUser = (req, res) => {
  User.findByIdAndDelete(req.params.id, (err, data) => {
    if (!err) {
      res.status(200).json({
        code: 200,
        message: "User deleted successfully",
        deletedUser: data,
      });
    }
  });
};
