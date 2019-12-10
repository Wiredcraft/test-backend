const { check, validationResult } = require('express-validator')
const createValidationRules = () => {
  return [
    // Name must exist
    check('name').not().isEmpty().withMessage("Please enter a name").isAlphanumeric().withMessage("Please enter a valid name"),
    // DOB must exist
    check('dob').not().isEmpty().withMessage("Please enter a date of birth"),
    // Address must exist
    check('address').not().isEmpty().withMessage("Please enter an ddress").isAlphanumeric().withMessage("Please use letter and numbers"),
    // Description should be alpha numerics
    check('description').isAlphanumeric().withMessage("Please use letter and numbers"),
  ]
}

const retrieveValidationRules = () => {
  return [
    // Id must exist
    check('userId').not().isEmpty().withMessage("Please enter userId to find a user"),
  ]
}

const updateValidationRules = () => {
  return [
    // Id must exist
    check('_id').not().isEmpty().withMessage("Id required to update user"),
    // Name must exist
    check('name').not().isEmpty().withMessage("Please enter a name"),
    // DOB must exist
    check('dob').not().isEmpty().withMessage("Please enter a date of birth"),
    // Description should be alpha numerics
    check('description').isAlphanumeric().withMessage("Please use letter and numbers"),
  ]
}

const deleteValidationRules = () => {
  return [
    // Id must exist
    check('_id').not().isEmpty().withMessage("Id required to remove user"),
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
