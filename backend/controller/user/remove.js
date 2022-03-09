const
  config = require('config'),
  { validate, success, failure } = require(config.middlewarePath),
  { userService } = require(config.servicePath);

const remove = async (req, res, next) => {
  const rule = {
    id: {required: true, type: 'string'}
  };

  try {
    let params = validate(req, rule);

    params._id = params.id;
    delete params.id;
    
    await userService.remove(params);

    return success(req, res, 'succeed');
  } catch (err) {
    return failure(req, res, err);
  }
}

module.exports = remove;