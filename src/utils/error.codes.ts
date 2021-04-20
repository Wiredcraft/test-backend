export class CustomError extends Error {}

export class ErrorUserNotFound extends CustomError {
  constructor() {
    super('User not found');
  }
}
