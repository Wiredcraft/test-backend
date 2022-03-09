const
  config = require('config'),
  { validate, success, failure} = require(config.middlewarePath),
  { userService } = require(config.servicePath),
  moment = require('moment');

const create = async (req, res, next) => {
  // create a rule to validate and filter parameters
  const rule = {
    name: {required: true, type: 'string'},
    dob: {required: true, type: 'string', convertType: 'date'},
    address: {required: true, type: 'string'},
    description: {required: true, type: 'string'},
    longitude: {required: false, type: 'number'},
    latitude: {required: false, type: 'number'},
  };

  try {
    // validate and filter parameters
    let params = validate(req, rule);

    params.createdAt = moment().format('YYYY-MM-DD');
    if (params.longitude && params.latitude) {
      params.location = [params.longitude, params.latitude];
      delete params.longitude;
      delete params.latitude;
    }

    let result = await userService.create(params);

    return success(req, res, result);
  } catch (err) {
    return failure(req, res, err);
  }
}

module.exports = create;