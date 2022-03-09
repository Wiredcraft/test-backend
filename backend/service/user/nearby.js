const
  config = require('config'),
  { userDal } = require(config.mongoDalPath),
  redis = require(config.redisPath);

const nearby = async (params) => {
  let cache = redis.getClient();

  // we should use redis.georadiusbymember here but the function hasn't been
  // included in node_moudles/@node-client. However, i'll solve this problem it as soon as possible
  // let userIds = await cache.georadiusbymember(config.redis.GEOKey,{
  //   member: params._id,
  //   radius: params.radius
  // });
  
  let userIds = [];

  // splice the id which is equal to the id in my params
  let idIndex = userIds.indexOf(params._id);

  if (idIndex >= 0) {
    userIds.splice(idIndex, 1);
  }

  params._id = {$in: userIds};

  let totalAndData = await Promise.all([
    userDal.count(params),
    userDal.findAll(params)
  ]);
  
  let ret = {
    total: totalAndData[0],
    data: totalAndData[1]
  };
  
  return ret;
  
};

module.exports = nearby;
