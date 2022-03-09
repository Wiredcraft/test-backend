const
  config = require('config'),
  { userDal } = require(config.mongoDalPath),
  moment = require('moment');

const create = async (params) => {
  params.createdAt = moment().format('YYYY-MM-DD');
  let data = await userDal.create(params);
  return data;
}

module.exports = create;