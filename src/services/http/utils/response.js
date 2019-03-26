'use strict'
/**
 * Standard response handle
 * @param {String} message
 */
let responseHandler = (message) => {
  let response = {
    data: message,
    status: 200
  }

  return response
}

/**
 * Error response handler
 * @param {String} message
 */
let errorHandler = (message) => {
  let response = {
    data: message,
    status: 400
  }

  return response
}

module.exports = {
  responseHandler, errorHandler
}
