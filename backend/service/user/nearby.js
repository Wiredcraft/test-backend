const
  config = require('config'),
  { userDal } = require(config.mongoDalPath),
  redis = require(config.redisPath);

const nearby = async (params) => {
  let cache = redis.getClient();

  // in @node-redis/client v1.0.4 we can use geoSearch but redis must up to 6.0.2
  let userIds = await cache.geoSearch(config.redis.GEOKey, params._id, {radius: params.radius, unit: params.unit});

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
