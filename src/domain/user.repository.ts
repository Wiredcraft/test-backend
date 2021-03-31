import { User, UserId } from './user.interface';

/**
 * Persists {@link User} instances to datastore.
 */
export abstract class UserRepository {
  /**
   * @param from the {@link UserId} to start the list, exclusive (the user with the given UserId will not be in the list). Give null to load from the beginning.
   * @param limit size of the list. Repository implementation may return more smaller list.
   * @returns a iterator of all users in datastore
   */
  abstract list(from: UserId, limit?: number): Promise<User[]>;

  /**
   * Create a new {@link User} and save it into datastore.
   *
   * @param user prameters for the newly created user
   */
  abstract create(user: User): Promise<void>;

  /**
   * Update a specified user in datastore.
   *
   * @param user the user to persist
   * @throws {@link UserNotFoundError}
   * Thrown if specified user does not exist in datastore
   */
  abstract update(user: User): Promise<void>;

  /**
   * Load a user specified by the given {@link UserId}.
   *
   * @param id the {@link UserId} to specify the target user
   * @throws {@link UserNotFoundError}
   * Thrown if specified user does not exist in datastore
   */
  abstract load(id: UserId): Promise<User | undefined>;

  /**
   * Delete a user specified by the given {@link UserId}.
   *
   * @param id the {@link UserId} to specify the target user
   * @throws {@link UserNotFoundError}
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
