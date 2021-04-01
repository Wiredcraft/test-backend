/**
 * UserId is non-emoty string. Usually it is UUID but not limited to.
 * Its length should be less than 36 characters (length of UUID with hyphen).
 */
export type UserId = string;

/**
 * The user requested to create. It has no {@link UserId},
 * because system will generate it automatically and
 * human (who sends request) has no control on it.
 */
export interface NewUser {
  /**
   * The non-empty user name displayed in the system, as known as display-name.
   * Its length should be less than 50 characters (same to Twitter).
   */
  name: string;
  /**
   * The user's date of birth. Could be null.
   */
  dob: Date;
  /**
   * The user's address. Could be null or empty.
   * Its length should be less than 30 characters (same to Twitter's 'location').
   */
  address: string;
  /**
   * The user's description. Could be null or empty.
   * Its length should be less than 160 characters (same to Twitter).
   */
  description: string;
  /**
   * Non-null date when user was created.
   */
  createdAt: Date;
}

/**
 * The user with {@link UserId}. Once registered to app, each user owns unique one {@link UserId}.
 */
export type User = NewUser & {
  id: UserId;
};
