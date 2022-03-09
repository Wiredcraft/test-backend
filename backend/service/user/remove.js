const
  config = require('config'),
  { userDal } = require(config.mongoDalPath);

const remove = async (params) => {
  return await userDal.findByIdAndDelete(params._id);
}

module.exports = remove;