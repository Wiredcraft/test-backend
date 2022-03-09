const
  config = require('config'),
  { validate, success, failure } = require(config.middlewarePath),
  { userService } = require(config.servicePath);

const nearby = async (req, res, next) => {
  const rule = {
    id: {required: true, type: 'string'},
    radius: {required: true, type:'number', convertType: 'number'},
    unit: {required: true, type: 'enum', values: ['m', 'km', 'ft', 'mi']}
  };

  try {
    let params = validate(req, rule);

    params._id = params.id;
    delete params.id;

    let result = await userService.nearby(params);

    return success(req, res, result);
  } catch (err) {
    return failure(req, res, err);
  }
};

module.exports = nearby;