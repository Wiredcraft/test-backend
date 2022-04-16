const mongoSvc = require('./mongo-service');
const User = require('../model/user-model');

const QueryBuilder = function() {
  const query = {}
  return {
    id: function(id) {
      if (id) {
        query['id'] = id
      }
      return this
    },
    name:function(name) {
      if (name) {
        query['name'] = name
      }
      return this
    },
    build: function() {
      return query
    }
  }
};

const svc = {

  /**
   * retrieve users from db
   * @param query {{ id: String, name: String }}
   * @param option {{ page: number, limit: number }}
   * @param logger { Pino }
   * @return {{ docs: Array, total: number }}
   */
  getUser: async function(query, option, logger = log) {
    const _log = logger.child({ module: 'user-service', method: 'getUser' });
    _log.info('retrieve user, query: %j, option: %j', query, option);

    const dbConnection = mongoSvc.getMongoConnection(_log);
    if (dbConnection == null) {
      _log.error('Cannot get mongodb connection.');
      throw new errors.InternalServerError('Cannot get mongodb connection.');
    }

    try {
      let q = QueryBuilder().id(query.id).name(query.name).build();
      const userModel = User.getUserModel(dbConnection);
      const { docs, total } = await userModel.paginate(q, option);
      _log.info(`got total ${total} records.`);
      _log.debug('docs: %j', docs);

      return { docs, total };
    } catch (err) {
      _log.error('retrieve user error: %j', errors.fullStack(err));
      throw new errors.InternalServerError(`Failed to retrieve user: ${err.message}`);
    }
  },

  /**
   * insert user doc to db
   * @param body {{ id: String, name: String, dob: String, address: String, description: String }}
   * @param logger { Pino }
   * @return {{ docs: Array }}
   */
  createUser: async function(body, logger = log) {
    const _log = logger.child({ module: 'user-service', method: 'createUser' });
    _log.info('create user: %j', body);

    const user = _.pick(body, ['id', 'name', 'dob', 'address', 'description']);
    _.checkRequired(user, ['id', 'name']);

    const dbConnection = mongoSvc.getMongoConnection(_log);
    if (dbConnection == null) {
      _log.error('Cannot get mongodb connection.');
      throw new errors.InternalServerError('Cannot get mongodb connection.');
    }

    try {
      const userModel = User.getUserModel(dbConnection);
      const docs = await userModel.create([user]);
      _log.info('user doc saved.');
      _log.debug('docs: %j', docs);

      return { docs };
    } catch (err) {
      _log.error('create user error: %j', errors.fullStack(err));
      throw new errors.InternalServerError(`Failed to create user: ${err.message}`);
    }
  },

  /**
   * update user doc
   * @param id { String }
   * @param body {{ name: String, dob: String, address: String, description: String }}
   * @param logger { Pino }
   * @return {{ matchedCount: number, modifiedCount: number, acknowledged: boolean, upsertedId: string, upsertedCount: number }}
   */
  updateUser: async function(id, body, logger = log) {
    const _log = logger.child({ module: 'user-service', method: 'updateUser' });
    _log.info('update user, id: %s, body: %j', id, body);

    if (_.isEmpty(id)) {
      _log.error('id is required.');
      throw new errors.BadRequestError('id is required.');
    }
    const user = _.pick(body, ['name', 'dob', 'address', 'description']);

    const dbConnection = mongoSvc.getMongoConnection(_log);
    if (dbConnection == null) {
      _log.error('Cannot get mongodb connection.');
      throw new errors.InternalServerError('Cannot get mongodb connection.');
    }

    try {
      const userModel = User.getUserModel(dbConnection);
      const result = await userModel.updateOne({ id }, user);
      _log.info('user doc updated: %j', result);

      return result;
    } catch (err) {
      _log.error('update user error: %j', errors.fullStack(err));
      throw new errors.InternalServerError(`Failed to update user: ${err.message}`);
    }
  },

  /**
   * delete user doc
   * @param id { String }
   * @param logger { Pino }
   * @return {{ acknowledged: boolean, deletedCount: number }}
   */
  deleteUser: async function(id, logger = log) {
    const _log = logger.child({ module: 'user-service', method: 'deleteUser' });
    _log.info(`delete user, id: ${id}`);

    if (_.isEmpty(id)) {
      _log.error('id is required.');
      throw new errors.BadRequestError('id is required.');
    }

    const dbConnection = mongoSvc.getMongoConnection(_log);
    if (dbConnection == null) {
      _log.error('Cannot get mongodb connection.');
      throw new errors.InternalServerError('Cannot get mongodb connection.');
    }

    try {
      const userModel = User.getUserModel(dbConnection);
      const result = await userModel.deleteOne({ id });
      _log.info('user doc deleted: %j', result);

      return result;
    } catch (err) {
      _log.error('delete user error: %j', errors.fullStack(err));
      throw new errors.InternalServerError(`Failed to delete user: ${err.message}`);
    }
  },

};

module.exports = svc;

