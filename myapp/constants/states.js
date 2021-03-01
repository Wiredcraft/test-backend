module.exports = {
  // Successful status codes.
  CREATED: 201,
  FETCHED: 200,
  UPDATED: 200,
  DELETED: 204,
  NORMAL_END: 200,

  // Error status codes for client errors.
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  METHOD_NOT_ALLOWED: 405,
  NOT_FOUND: 404,

  // Error status codes for server errors.
  INTERNAL_SERVER_ERROR: 500
};