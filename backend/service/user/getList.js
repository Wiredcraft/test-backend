const
  config = require('config'),
  { userDal } = require(config.mongoDalPath);

const getList = async (params) => {
  let totalAndData = await Promise.all([
    userDal.count(params),
    userDal.findAll(params)
  ]);
  
  let ret = {
    total: totalAndData[0],
    data: totalAndData[1]
  };
  
  return ret;
}

module.exports = getList;