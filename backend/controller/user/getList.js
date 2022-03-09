const
  config = require('config'),
  { validate, success, failure } = require(config.middlewarePath),
  { userService } = require(config.servicePath);

const getList = async (req, res, next) => {
  const rule = {
    skip: {required: true, type:'int', convertType: 'int'},
    limit: {required: true, type: 'int', convertType: 'int'}
  };

  try {
    let params = validate(req, rule);

    let result = await userService.getList(params);

    return success(req, res, result);
  } catch (err) {
    return failure(req, res, err);
  }
}

module.exports = getList;