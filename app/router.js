'use strict';

module.exports = app => {
    app.router.resources('user', '/api/v1/user', 'user');
};