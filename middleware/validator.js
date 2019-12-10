const { check, validationResult } = require('express-validator')
const createValidationRules = () => {
  return [
    // Name must exist
    check('name').not().isEmpty(),
    // DOB must exist
    check('dob').not().isEmpty(),
    // Address must exist
    check('address').not().isEmpty(),
  ]
}

const webValidate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  req.session.val_errors = extractedErrors;
  return next();
/*
  return res.status(422).json({
    errors: extractedErrors,
  })
*/
}

module.exports = {
  createValidationRules,
  webValidate,
}
