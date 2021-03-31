export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`No user found with user ID ${id}`);
  }
}
export class UserFoundError extends Error {
  constructor(id: string) {
    super(`User found with user ID ${id}`);
  }
}
