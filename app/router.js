'use strict';

module.exports = app => {
    const { router, controller } = app; 
    router.resources('user', '/api/v1/user', 'user');
    router.post('/api/v1/user/follow', controller.user.follow);
    router.post('/api/v1/user/unfollow', controller.user.unfollow);
};