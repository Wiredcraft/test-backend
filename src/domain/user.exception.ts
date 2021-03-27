export class UserNotFoundException extends Error {
  constructor(id: string) {
    super(`No user found with user ID ${id}`);
  }
}
