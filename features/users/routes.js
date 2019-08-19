"use strict";

module.exports = (app) => {
  var base
	var controller = require('./controller');

  let auth = controller.isAuthenticated.bind(controller);

	app.route('/users')
		.get(controller.getUsers.bind(controller))
		.post(controller.createUser.bind(controller));



/*	
	app.route('/users')
		.get(auth, controller.getCategories.bind(controller))
	  .post(auth, controller.createCategory.bind(controller));

	app.route('/user/:id')
	  .get(auth, controller.getCategory.bind(controller))
		.put(auth, controller.updateCategory.bind(controller))
	  .delete(auth, controller.deleteCategory.bind(controller));
*/
};
