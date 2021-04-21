export class CustomError extends Error {}

export class ErrorUserNotFound extends CustomError {
  constructor() {
    super('User not found');
  }
}

export class ErrorFriendNotFound extends CustomError {
  constructor() {
    super('Friend not found');
  }
}
