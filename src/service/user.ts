import assert from 'assert';
import { MongoDB } from '../db/mongo';
import { User } from '../entity/user';
import { ERROR } from '../config/constant';
import { UserModel } from '../model/user';

export class UserService {
  private model: UserModel;

  constructor(db: MongoDB) {
    this.model = new UserModel(db);
  }

  /**
   * From given user return the nearby users
   *
   * @param user given user
   * @param page page from 0
   * @param limit how many user will be found in 1 page
   * @returns User[]
   */
  async getNearbyList(user: User, page: number, limit = 10) {
    assert(
      Array.isArray(user.location),
      ERROR.SERVICE_USER_GETNEARBYLIST_LACK_LOCATION
    );

    return this.model.get({
      skip: page * limit,
      take: limit,
      where: {
        location: {
          $near: user.location,
          $maxDistance: 5000
        } as any

        // FindOperator not working
        // _id: Not(Equal(user._id))
      }
    });
  }
}
