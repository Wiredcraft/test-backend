var request = require('supertest');
var testAccount = {
  name: 'test',
  password: '123456'
}
exports.login = function(done){
  var agent = request.agent(sails.hooks.http.app);
  agent
    .post('/auth/login')
    .send(testAccount)
    .end(function (err, res) {
      if (err) done(err);
      done(agent);
    });
}
