const
  config = require('config'),
  { userDal } = require(config.mongoDalPath);

const update = async (params) => {
  let user = await userDal.findOneAndUpdate(params);
  return user;
}

module.exports = update;