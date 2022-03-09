const
  config = require('config'),
  { validate, success, failure } = require(config.middlewarePath),
  { userService } = require(config.servicePath);

const updateLocation = async (req, res, next) => {
  const rule = {
    id: {required: true, type: 'string'},
    longitude: {required: true, type: 'number'},
    latitude: {required: true, type: 'number'},
    isLogoff: {required: false, type: 'boolean'}
  };

  try {
    let params = validate(req, rule);
    
    params._id = params.id;
    delete params.id;
    
    let result = await userService.updateLocation(params);

    return success(req, res, result);
  } catch (err) {
    return failure(req, res, err);
  }
}

module.exports = updateLocation;