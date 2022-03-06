'use strict';

module.exports = (app) => {
  const { router, controller, middleware } = app;
  const checkToken = middleware.checkToken;

  router.get('/friend/:id/following', checkToken(), controller.friend.getFollowings);
  router.get('/friend/:id/follower', checkToken(), controller.friend.getFollowers);
  router.get('/friend/:id/mutual', checkToken(), controller.friend.getMatualFollowers);
  router.post('/friend/follower/:id', checkToken(), controller.friend.followNewUser);
  router.delete('/friend/follower/:id', checkToken(), controller.friend.removeFollower);
  router.get('/friend/:id/nearby', checkToken(), controller.friend.getNearbyFriends);
}