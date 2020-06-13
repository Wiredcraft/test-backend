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

export class InvalidUserAccount extends Unauthorized {
  name = 'InvalidUserAccount';
  constructor() {
    super('Invalid user account');
  }
}

export class UserSessionExpired extends Unauthorized {
  name = 'UserSessionExpired';
  constructor() {
    super('User session expired');
  }
}

export class UserPermissionDenied extends Forbidden {
  name = 'UserPermissionDenied';
  constructor() {
    super('User permission denied');
  }
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

export class UserLinkNotFound extends NotFound {
  name = 'UserLinkNotFound';
  constructor() {
    super('User link not found');
  }
}

export class UserLinkAlreadyExists extends Conflict {
  name = 'UserLinkAlreadyExists';
  constructor() {
    super('User link already exists');
  }
}

export class InvalidUserLink extends BadRequest {
  name = 'InvalidUserLink';
  constructor() {
    super('Invalid user link');
  }
}
