/**
 * This file provides the validation rules for data entered on the front end
 * VR will be used as a postfix of the rule names primarily to save space
 *
 **/

const { body, check, oneOf, validationResult } = require('express-validator')
/**
 * Validate parameters when creating a user
 * 
 * Used by web and api routers
 *
 **/
const createVR = () => {
  return [
    // Name must exist
    check('name').not().isEmpty().withMessage("Please enter a name").not().isAlphanumeric().withMessage("Please enter a valid name"),
    // DOB must exist
    check('dob').not().isEmpty().withMessage("Please enter a date of birth"),
    // Address must exist
    check('address').not().isEmpty().withMessage("Please enter an address").not().isAlphanumeric().withMessage("Please use letter and numbers"),
    // Description should be alpha numerics
    check('description').not().isAlphanumeric().withMessage("Please use letter and numbers"),
    check('position.coordinates.*').not().isEmpty().withMessage("Please enter a longitude and latitude"),
    check('position.coordinates.lng[0]').not().isFloat({min: -180, max: 180}).withMessage("Longitude between -180 and 180 degrees, inclusive"),
    check('position.coordinates.lat[1]').not().isFloat({min: -90, max: 90}).withMessage("Latitude between -90 and 90 degrees, inclusive")
  ]
}

/**
 * Validate parameters when retrieving a user
 *
 * Used by web and api routers
 *
 **/
const retrieveVR = () => {
  return [
    // Id must exist
    check('personId').not().isEmpty().withMessage("Please enter userId to find a user"),
  ]
}

/**
 * Validate parameters when updating a user
 *
 * This is used only by the web router. 
 * 
 *
 **/
const updateVR = () => {
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
    check('position.coordinates.*').not().isEmpty().withMessage("Please enter a longitude and latitude"),
    check('position.coordinates.lng[0]').not().isFloat({min: -180, max: 180}).withMessage("Longitude between -180 and 180 degrees, inclusive"),
    check('position.coordinates.lat[1]').not().isFloat({min: -90, max: 90}).withMessage("Latitude between -90 and 90 degrees, inclusive")
  ]
}

/**
 * Validate parameters when updating/changing a user
 *
 * This is used only by the api router
 *
 **/
const changeVR = () => {
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
        check('description').not().isAlphanumeric(),
    ], "At least one field must be sent with the new data"),
  ]
}

/**
 * Validate parameters when deleting a user
 *
 * This is used by the web and api routers
 *
 **/
const deleteVR = () => {
  return [
    // Id must exist
    check('_id').not().isEmpty().withMessage("Id required to remove user"),
  ]
}

/**
 * Validate parameters when a user logs in
 *
 * This is used by the web router
 *
 **/
const loginVR = () => {
  return [
    // Id must exist
    check('dronename').not().isEmpty().withMessage("Pleae enter a username"),
    check('password').not().isEmpty().withMessage("Pleae enter a password"),
  ]
}

/**
 * Validate parameters when a user registers 
 *
 * This is used by the web router
 *
 **/
const registerVR = () => {
  return [
    // Id must exist
    check('dronename').not().isEmpty().withMessage("Pleae enter a username"),
    check('password').not().isEmpty().withMessage("Pleae enter a password"),
    check('password').not().isLength({min: 5}).withMessage("Password must be at least 5 characters in length")
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
  createVR,
  retrieveVR,
  updateVR,
  deleteVR,
  changeVR,
  loginVR,
  registerVR,
  webValidate,
  apiValidate,
}
