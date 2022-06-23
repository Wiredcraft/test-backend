import { MongoDB } from '../db/mongo';
import { UserModel } from '../model/user';

export class UserService {
  private model: UserModel;

  constructor(db: MongoDB) {
    this.model = new UserModel(db);
  }

  /**
   * Get nearby user list
   *
   * @param location [longitude, latitude]
   * @param page page from 0
   * @param limit how many user will be found in 1 page
   * @returns User[]
   */
  async getNearbyList(location: [number, number], page: number, limit = 10) {
    return this.model.get({
      skip: page * limit,
      take: limit,
      where: {
        location: {
          $near: location,
          $maxDistance: 5000
        } as any
      }
    });
  }
}
