class BaseError extends Error {
  constructor (message, status) {
    super(message)

    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.status = status || 200
  }
}

class AppError extends BaseError {
  constructor (errorCode, message, status) {
    super(JSON.stringify({ errorCode, message }), status)
  }
}

const panic = (errorCode, message, status) => {
  throw new AppError(errorCode, message, status)
}

module.exports = {
  AppError,
  panic
}
