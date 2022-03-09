const
  Parameter = require('parameter');

let parameter = new Parameter();

const validate = (req, rule) => {
  let data = {...req.body, ...req.params, ...req.query};

  let param = {};

  Object.keys(rule).forEach((key) => {
    param[key] = data[key];
  });

  let errors = parameter.validate(rule, param);

  if (errors) {
    throw new Error('validation error');
  }

  return param;
};

module.exports = validate;