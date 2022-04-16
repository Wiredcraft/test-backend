const userSvc = require('../service/user-service');

const svc = {

  getUser: async function(req) {
    let { query, log } = req;
    let options = {
      page: query.page || 1,
      limit: query.limit || 1,
    }
    return userSvc.getUser(query, options, log);
  },

  createUser: async function(req) {
    let { body, log } = req;
    return userSvc.createUser(body, log);
  },

  updateUser: async function(req) {
    let { query, body } = req;
    return userSvc.updateUser(query.id, body, req.log);
  },

  deleteUser: async function(req) {
    let { query } = req;
    return userSvc.deleteUser(query.id, req.log);
  },

};

module.exports = svc;
