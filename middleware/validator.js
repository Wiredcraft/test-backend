const { check, validationResult } = require('express-validator')
const createValidationRules = () => {
  return [
    // Name must exist
    check('name').not().isEmpty().withMessage("Name is a required parameter"),
    // DOB must exist
    check('dob').not().isEmpty().withMessage("Date of Birth is a required parameter"),
    // Address must exist
    check('address').not().isEmpty().withMessage("Address is a required parameter"),
  ]
}

const retrieveValidationRules = () => {
  return [
    // Id must exist
    check('id').not().isEmpty().withMessage("Id is a required parameter"),
  ]
}

const updateValidationRules = () => {
  return [
    // Id must exist
    check('_id').not().isEmpty().withMessage("Id is a required parameter"),
    // Name must exist
    check('name').not().isEmpty().withMessage("Name is a required parameter"),
    // DOB must exist
    check('dob').not().isEmpty().withMessage("Date of Birth is a required parameter"),
  ]
}

const deleteValidationRules = () => {
  return [
    // Id must exist
    check('id').not().isEmpty().withMessage("Id is a required parameter"),
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
}

const apiValidate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  createValidationRules,
  retrieveValidationRules,
  updateValidationRules,
  webValidate,
}
