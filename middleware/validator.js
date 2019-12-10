const { check, oneOf, validationResult } = require('express-validator')
/**
 * Validate parameters when creating a user
 * 
 * Used by web and api routers
 *
 **/
const createValidationRules = () => {
  return [
    // Name must exist
    check('name').not().isEmpty().withMessage("Please enter a name").not().isAlphanumeric().withMessage("Please enter a valid name"),
    // DOB must exist
    check('dob').not().isEmpty().withMessage("Please enter a date of birth"),
    // Address must exist
    check('address').not().isEmpty().withMessage("Please enter an address").not().isAlphanumeric().withMessage("Please use letter and numbers"),
    // Description should be alpha numerics
    check('description').not().isAlphanumeric().withMessage("Please use letter and numbers"),
  ]
}

/**
 * Validate parameters when retrieving a user
 *
 * Used by web and api routers
 *
 **/
const retrieveValidationRules = () => {
  return [
    // Id must exist
    check('userId').not().isEmpty().withMessage("Please enter userId to find a user"),
  ]
}

/**
 * Validate parameters when updating a user
 *
 * This is used only by the web router. 
 * 
 *
 **/
const updateValidationRules = () => {
  return [
    // Id must exist
    check('_id').not().isEmpty().withMessage("Id required to update user"),
    // Name must exist
    check('name').not().isEmpty().withMessage("Enter a name or leave default"),
    // DOB must exist
    check('dob').not().isEmpty().withMessage("Enter a date of birth or leave default"),
    // Address must exist
    check('address').not().isEmpty().withMessage("Enter a name or leave current value"),
    // Description should be alpha numerics
    check('description').not().isAlphanumeric().withMessage("description should be alpha numberic"),
  ]
}

/**
 * Validate parameters when updating/changing a user
 *
 * This is used only by the api router
 *
 **/
const changeValidationRules = () => {
  return [
    check('criteria._id', "Must have an id to change user").not().isEmpty(), 
    // Update must exist
    check('update').not().isEmpty().withMessage("Update data required to change user"),
    oneOf([
        // Name must exist
        check('name').not().isEmpty(),
        // DOB must exist
        check('dob').not().isEmpty(),
        // Description should be alpha numerics
        check('description').not().isAlphanumeric()
    ], "At least one field must be sent with the new data"),
  ]
}

/**
 * Validate parameters when deleting a user
 *
 * This is used by the web and api routers
 *
 **/
const deleteValidationRules = () => {
  return [
    // Id must exist
    check('_id').not().isEmpty().withMessage("Id required to remove user"),
  ]
}

/**
 * This is where the errors are aggregated, and prepared to 
 * be sent back to a web page. The errors are stored in a session
 * variable and loaded on the page to later be displayed. 
 * Only used by the web router
 **/
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

/**
 * This is where the errors are aggregated, and prepared to 
 * be sent back to a requesting agent as a JSON object.
 *  
 * Only used by the api router
 **/
const apiValidate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  //errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  errors.array().map(err => extractedErrors.push(err.msg))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  createValidationRules,
  retrieveValidationRules,
  updateValidationRules,
  deleteValidationRules,
  changeValidationRules,
  webValidate,
  apiValidate,
}
