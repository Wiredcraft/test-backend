// todo: realize skip and limit
const
  config = require('config'),
  { userDal } = require(config.mongoDalPath),
  redis = require(config.redisPath);

const calcuateMax = (params) => {
  const unitNumMap = {
    m: 1,
    km: 1000,
    ft: 0.3048,
    mi: 1609.344
  };
  return params.radius * unitNumMap[params.unit];
};

const getNearbyFromRedis = async (params) => {
  let cache = redis.getClient();

  // in @node-redis/client v1.0.4 we can use the geoSearch function but redis must upgrade to 6.0.2
  let nearByUserIds = await cache.geoSearch(config.redis.GEOKey, params._id, {radius: params.radius, unit: params.unit});
  
  if (!nearByUserIds.length) return null;

  // redis will return the id which has already included in our param, so we should splice it
  let idIndex = nearByUserIds.indexOf(params._id);

  if (idIndex >= 0) {
    nearByUserIds.splice(idIndex, 1);
  }

  params._id = {$in: nearByUserIds};

  let nearbyUsers = await userDal.findAll(params)
  
  return nearbyUsers;
}

const getNearbyFromMongo = async (params) => {
  let user = await userDal.findById(params._id);

  if (!user || !user.location || !user.location.length) return ret;

  let query = {
    near: [user.location[0], user.location[1]],
    max: calcuateMax({radius: params.radius, unit: params.unit})
  };

  let nearbyUsers = await userDal.getNearbyUsers(query);

  return nearbyUsers
};

const nearby = async (params) => {
  let isErr = false;
  let usersNearby = null;

  try {
    usersNearby = await getNearbyFromRedis(params);
  } catch (err) {
    isErr = err;
  }
  
  if (isErr || !usersNearby) {
    usersNearby = await getNearbyFromMongo(params);
  }

  return usersNearby;
};

module.exports = nearby;
