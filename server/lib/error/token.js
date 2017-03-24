export const TOKEN_INVALID = {
  statusCode: 401,
  name: 'InvalidAccessToken',
  message: 'This accessToken is not valid.'
}

export const TOKEN_NOT_FOUND = {
  statusCode: 412,
  name: 'TokenNotFound',
  message: 'The token is not found, you have been already logout.'
}

export const TOKEN_NOT_EXIST_TO_LOGOUT = {
  statusCode: 412,
  name: 'TokenNotExist',
  message: 'There is no login token available to logout.'
}
