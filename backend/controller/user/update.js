const
  config = require('config'),
  { validate, success, failure } = require(config.middlewarePath),
  { userService } = require(config.servicePath);

const update = async (req, res, next) => {
  const rule = {
    id: {required: true, type: 'string'},
    name: {required: false, type: 'string'},
    dob: {required: false, type: 'date'},
    address: {required: false, type: 'string'},
    longitude: {required: false, type: 'number'},
    latitude: {required: false, type: 'number'},
    description: {required: false, type: 'string'}
  };

  try {
    let params = validate(req, rule);
    
    params._id = params.id;
    delete params.id;
    
    let result = await userService.update(params);

    return success(req, res, result);
  } catch (err) {
    return failure(req, res, err);
  }
}

module.exports = update;