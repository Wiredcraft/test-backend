import { NewUser, User, UserId } from './user.interface';

/**
 * Persists {@link User} instances to datastore.
 */
export abstract class UserRepository {
  /**
   * @returns a iterator of all users in datastore
   */
  abstract list(): Promise<IterableIterator<User>>;

  /**
   * Create a new {@link User} and save it into datastore.
   *
   * @param user prameters for the newly created user
   * @returns the newly created user
   */
  abstract create(user: NewUser): Promise<User>;

  /**
   * Update a specified user in datastore.
   *
   * @param user the user to persist
   * @throws {@link UserNotFoundException}
   * Thrown if specified user does not exist in datastore
   */
  abstract update(user: User): Promise<void>;

  /**
   * Load a user specified by the given {@link UserId}.
   *
   * @param id the {@link UserId} to specify the target user
   * @throws {@link UserNotFoundException}
   * Thrown if specified user does not exist in datastore
   */
  abstract load(id: UserId): Promise<User | undefined>;

  /**
   * Delete a user specified by the given {@link UserId}.
   *
   * @param id the {@link UserId} to specify the target user
   * @throws {@link UserNotFoundException}
   * Thrown if specified user does not exist in datastore
   */
  abstract delete(id: UserId): Promise<void>;

  /**
   * Delete all users in datastore.
   *
   * @remarks This method is provided for unit test.
   */
  abstract deleteAll(): Promise<void>;
}
