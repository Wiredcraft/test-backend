var request = require('supertest');
exports.login = function(done) {
  var agent = request.agent(sails.hooks.http.app);
  agent
    .post('/login')
    .send({
      username: 'test',
      password: '123456'
    })
    .end(function(err, res) {
      if (err) done(err);
      done(agent);
    });
}

exports.admin = function(done) {
  var agent = request.agent(sails.hooks.http.app);
  agent
    .post('/login')
    .send({
      username: 'admin',
      password: '123456'
    })
    .end(function(err, res) {
      if (err) done(err);
      done(agent);
    });
}