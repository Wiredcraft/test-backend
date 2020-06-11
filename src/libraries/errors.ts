export class BadRequest extends Error {
  statusCode = 400;
  name = 'BadRequest';
}

export class Unauthorized extends Error {
  statusCode = 401;
  name = 'Unauthorized';
}

export class Forbidden extends Error {
  statusCode = 403;
  name = 'Forbidden';
}

export class NotFound extends Error {
  statusCode = 404;
  name = 'NotFound';
}

export class Conflict extends Error {
  statusCode = 409;
  name = 'Conflict';
}

export class InternalServerError extends Error {
  statusCode = 500;
  name = 'InternalServerError';
}

export class UserNotFound extends NotFound {
  name = 'UserNotFound';
  constructor() {
    super('User not found');
  }
}

export class UserAlreadyExists extends Conflict {
  name = 'UserAlreadyExists';
  constructor() {
    super('User already exists');
  }
}
