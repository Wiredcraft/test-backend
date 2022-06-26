/**
 * # User Service
 *
 * For user data's CRUD.
 *
 * ## Injected Dependency
 *
 * - [UserModel](../modules/model_user.html)
 *
 * @module
 */
import assert from 'assert';
import { User } from '../entity/user';
import { ERROR } from '../config/constant';
import { UserModel } from '../model/user';
import { Inject, Provide } from '../util/container';
import { FindManyOptions, Like, ObjectID } from 'typeorm';

// @ts-ignore
import { ObjectId } from 'mongodb';

export enum NearbyType {
  NO_RELATION,
  FOLLOWERS,
  FOLLOWING
}

@Provide()
export class UserService {
  @Inject('userModel')
  private model: UserModel;

  /**
   * Get user list with page
   *
   * @param searchName
   * @param page
   * @param limit
   * @returns
   */
  async getList(searchName: string, page: number, limit = 10) {
    const condition: FindManyOptions = { skip: page * limit, take: 10 };
    if (searchName.length) {
      condition.where = {
        name: Like(searchName)
      };
    }
    return this.model.get(condition);
  }

  /**
   * Get user by ID
   *
   * @param _id
   * @returns User | null
   */
  async getById(_id: ObjectID | string) {
    return this.model.getOneById(_id);
  }

  /**
   * Update user
   *
   * @param user
   * @returns
   */
  async update(user: User) {
    return this.model.update({ _id: user._id }, user);
  }

  /**
   * Delete user
   *
   * @param _id
   * @returns
   */
  async delete(_id: ObjectID | string) {
    return this.model.delete({ _id: ObjectId(_id) });
  }

  /**
   * From given user return the nearby users
   *
   * @param user given user
   * @param page page from 0
   * @param limit how many user will be found in 1 page
   * @returns User[]
   */
  async getNearbyList(user: User, type: NearbyType, page: number, limit = 10) {
    assert(
      Array.isArray(user.location),
      ERROR.SERVICE_USER_GETNEARBYLIST_LACK_LOCATION
    );

    let [fromKey, toKey] = ['fromId', 'toId'];
    switch (type) {
      // For no relation case
      case NearbyType.NO_RELATION:
        return this.model.get({
          skip: page * limit,
          take: limit,
          where: {
            location: {
              $near: user.location,
              $maxDistance: 5000
            } as any // FindOperator not working
          }
        });
      // For query nearby followers
      case NearbyType.FOLLOWERS:
        // Opposite case
        [toKey, fromKey] = [fromKey, toKey];
      // For query nearby following
      case NearbyType.FOLLOWING:
        // Normal case
        return this.model.aggregate<User>([
          // 1. sort all user in geo order from ${user.location}
          {
            $geoNear: {
              near: user.location,
              distanceField: 'distance',
              maxDistance: 5000
            }
          },
          // 2. query following relation (normal case)
          {
            $lookup: {
              from: 'relation',
              // I. filter the someone's id that
              localField: '_id',
              // II. match what the following's id (toId) of each relation
              foreignField: toKey,
              // III. only if the relation's fromId equals ${user._id}
              pipeline: [{ $match: { [fromKey]: ObjectId(user._id) } }],
              as: 'relationship'
            }
          },
          // 3. filter fromId = ${user._id} and toId = *
          //    which means all the ${user}'s following
          {
            $match: {
              [`relationship.0.${fromKey}`]: ObjectId(user._id)
            }
          },
          // 4. pagination
          { $skip: page * limit },
          { $limit: limit }
        ]);
    }
  }
}
