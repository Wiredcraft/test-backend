"use strict";

module.exports = (app) => {
  var base
	var controller = require('./controller');

  let auth = controller.isAuthenticated.bind(controller);

	app.route('/users')
		.get(controller.getUsers.bind(controller))
		.post(controller.createUser.bind(controller));

	app.route('/user/:id')
		.get(controller.getUser.bind(controller))
		.put(auth, controller.updateUser.bind(controller))
		.delete(controller.deleteUser.bind(controller));

	app.route('/:id/meet/:friend')
		.get(controller.meet.bind(controller));
	app.route('/:id/break/:friend')
		.get(controller.break.bind(controller));

	app.route('/me')
		.get(auth, controller.getMe.bind(controller));

	app.route('/users/mocks/:qtt')
		.get(controller.mockUsers.bind(controller));

};
