export const INVALID_ERROR = err => ({
  statusCode: 412,
  name: 'InvalidError',
  message: err.message
})

export const MONGO_ERROR = err => ({
  statusCode: 400,
  name: 'Error',
  message: err.message
})
