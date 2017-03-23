export const USER_NAME_BEEN_TAKEN = {
  statusCode: 412,
  name: 'UserNameTaken',
  message: 'This username have been taken already.'
}

export const USER_CREDENTIALS_MISSING = {
  statusCode: 412,
  name: 'CredentialInvalid',
  message: 'This username and password are required.'
}

export const USER_CREDENTIALS_INVALID = {
  statusCode: 412,
  name: 'CredentialInvalid',
  message: 'This username and password are not match.'
}

export const USER_NOT_FOUND = {
  statusCode: 412,
  name: 'UserNotFound',
  message: 'The user is not found, please check details.'
}

export const USER_UNAUTHORIZED = {
  statusCode: 401,
  name: 'UserNotAuthorized',
  message: 'The user is not Authorized, can not update user info.'
}

export const USER_PREVENTED = {
  statusCode: 403,
  name: 'UserPrevented',
  message: 'This user have no right to update the target user info.'
}
