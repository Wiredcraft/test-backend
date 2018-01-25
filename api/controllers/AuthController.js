/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	login: function(req, res) {
		var username = req.param('username');
		var password = req.param('password');
		if(!username) return res.badRequest({message: 'username Invalid'});
		if(!password) return res.badRequest({message: 'password Invalid'});
    User.authenticate(username, password, function(err, user, info){
      if((err) || (!user)) {
        return res.unauthorized({
          message: info.message,
          user
        });
      }
			req.session.userId = user.id;
			req.session.authenticated = true;
			if (user.isAdmin) req.session.isAdmin = true;
      return res.send({
        message: info.message,
        user
      });
    });
  },
	signup: function(req, res){
		User.create({
			username: req.param('username'),
			password: req.param('password')
		}).exec(function(err, newUser){
			if(err) {
				if (!_.isArray(err.invalidAttributes.password)) {
              return res.badRequest(err);
        }
			}
			return res.send(newUser)
		});
	},
	current: function(req, res){
		if(req.session.authenticated == true){
				return res.send({'id': req.session.userId});
		}
		return res.unauthorized({message: "Unauthorized"});
	}
}
