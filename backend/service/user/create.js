const
  config = require('config'),
  { userDal } = require(config.mongoDalPath);

const create = async (params) => {
  let data = await userDal.create(params);
  return data;
}

module.exports = create;