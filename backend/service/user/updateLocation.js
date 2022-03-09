const
  config = require('config'),
  { userDal } = require(config.mongoDalPath),
  redis = require(config.redisPath);

const updateLocation = async (params) => {
  let cache = redis.getClient();

  await cache.geoAdd(config.redis.GEOKey, {
    longitude: params.longitude,
    latitude: params.latitude,
    member: params._id
  })

  if (params.isLogoff) {
    params.location = [params.longitude, params.latitude];
    
    await userDal.findOneAndUpdate(params);
  }
  return 'success';
}

module.exports = updateLocation;