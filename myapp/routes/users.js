const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');
const userRoot = '';
const userId = ':userId';
const otherUserId = ':otherUserId';
const followings = 'followings';
const follwers = 'followers';
const friends = 'friends';

// Currently we don't support calling different version of the api, all
// the api users should call the same version of the api. Calling different
// versions of the user api will be supported here in the future.
router
  // Simple user apis.
  .get(`${userRoot}/`, UserController.listAllUsers)
  .post(`${userRoot}/`, UserController.createUser)
  .get(`${userRoot}/${userId}`, UserController.findUserById)
  .put(`${userRoot}/${userId}`, UserController.updateUser)
  .delete(`${userRoot}/${userId}`, UserController.deleteUser)

  // Followings apis.
  .get(
    `${userRoot}/${userId}/${followings}`,
    UserController.listAllFollowings
  )
  .get(
    `${userRoot}/${userId}/${followings}/${otherUserId}`,
    UserController.FindFollowingById
  )
  .post(
    `${userRoot}/${userId}/${followings}/${otherUserId}`,
    UserController.createFollowing
  )
  .delete(
    `${userRoot}/${userId}/${followings}/${otherUserId}`,
    UserController.deleteFollowing
  )

  // Followers apis.
  .get(
    `${userRoot}/${userId}/${follwers}`,
    UserController.listAllFollowers
  )
  .get(
    `${userRoot}/${userId}/${follwers}/${otherUserId}`,
    UserController.findFollowerById
  )
  .post(
    `${userRoot}/${userId}/${follwers}/${otherUserId}`,
    UserController.createFollower
  )
  .delete(
    `${userRoot}/${userId}/${follwers}/${otherUserId}`,
    UserController.deleteFollower
  )

  // Friends apis.
  .get(
    `${userRoot}/${userId}/${friends}`,
    UserController.listAllFriends
  )
  .get(
    `${userRoot}/${userId}/${friends}/${otherUserId}`,
    UserController.FindFriendById
  );


module.exports = router;
