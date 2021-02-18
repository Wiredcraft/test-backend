
const validationFail = (code = null, message = null) => ({
  errCode: code || 10000,
  msg: message || 'user body validation failed'
})

const userDuplicateEntry = (code = null, message = null) => ({
  errCode: code || 10001,
  msg: message || 'name already exists'
})

const userCreationFail = (code = null, message = null ) => ({
  errCode: code || 10002,
  msg: message || 'user creation failed'
})

const userNotFound = (code = null, message = null) => ({
  errCode: code || 10003,
  msg: message || 'user not found'
})

const userFetchFail = (code = null, message = null) => ({
  errCode: code || 10004,
  msg: message || 'failed fetching users'
})

const userDeletionFail = (code = null, message = null ) => ({
  errCode: code || 10005,
  msg: message || 'failed deleting given user'
})

const userUpdateFail = (code = null, message = null ) => ({
  errCode: code || 10006,
  msg: message || 'failed updating given user'
})

const userChangePasswordFail = (code = null, message = null) => ({
  errCode: code || 10007,
  msg: message || 'failed changing password'
})

const voidFollowing = (code = null, message = null) => ({
  errCode: code || 10008,
  msg: message || 'can not follow or get followed by void'
})

const userFollowFail = (code = null, message = null) => ({
  errCode: code || 10009,
  msg: message || 'failed following given user'
})

const notFollowed = (code = null, message = null) => ({
  errCode: code || 10010,
  msg: message || 'given following relation does not exist'
})

const duplicateFollowing = (code = null, message = null) => ({
  errCode: code || 10011, 
  msg: message || 'user already followed'
})
const userUnfollowFail = (code = null, message = null) => ({
  errCode: code || 10012,
  msg: message || 'failed unfollowing given user'
});

const getFollowerFail = ( code = null, message = null ) => ({
  errCode: code || 10013,
  msg: message || 'failed fetching followers'
})

const userLoginNotFound = (code = null, message = null) => ({
  errCode: code || 10014,
  msg: message || 'user not found, try again with different username and pwd'
})

const userLoginFail = (code = null, message = null) => ({
  errCode: code || 10015,
  msg: message || 'user login failed'
})

const authGuardFail = (code = null, message = null) => ({
  errCode: code || 10016,
  msg: message || 'you must be logged in'
})

export {
  validationFail,
  userDuplicateEntry,
  userCreationFail,
  userNotFound,
  userFetchFail,
  userDeletionFail,
  userUpdateFail,
  userChangePasswordFail,
  voidFollowing,
  userFollowFail,
  notFollowed,
  userUnfollowFail,
  duplicateFollowing,
  getFollowerFail,
  userLoginNotFound,
  userLoginFail,
  authGuardFail
}