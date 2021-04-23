import { Inject, Injectable } from '@nestjs/common';
import { FriendRepository } from '../../../domain/friend/friend.repository';
import { CreateFriendDto, Friend } from 'src/domain/friend/friend.types';
import { FriendEntity } from './friend.entity';
import { Op, QueryTypes, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UserEntity } from '../user/user.entity';
import { User } from 'src/domain/user/user.types';
import { UniqueConstraintError } from 'sequelize';
import { ErrorFriendAlreadyExists } from '../../../utils/error.codes';

@Injectable()
export class FriendRepositoryPostgres implements FriendRepository {
  constructor(
    @Inject('SEQUELIZE') private readonly sequelizeInstance: Sequelize,
  ) {}

  public static getOrderedUserIds(params: {
    userId: string;
    otherUserId: string;
  }) {
    if (
      params.userId === params.otherUserId ||
      params.userId < params.otherUserId
    ) {
      return params;
    }
    return {
      userId: params.otherUserId,
      otherUserId: params.userId,
    };
  }

  findByUserId(params: {
    userId: string;
    offset: number;
    limit: number;
    transaction?: Transaction;
  }): Promise<Friend[]> {
    return FriendEntity.findAll({
      transaction: params.transaction,
      offset: params.offset,
      limit: params.limit,
      where: {
        [Op.or]: [
          {
            userId: params.userId,
          },
          {
            otherUserId: params.userId,
          },
        ],
      },
    });
  }

  findByUserIds(params: {
    userId: string;
    otherUserId: string;
    transaction?: Transaction;
  }): Promise<Friend> {
    const userIds = FriendRepositoryPostgres.getOrderedUserIds(params);

    return FriendEntity.findOne({
      transaction: params.transaction,
      where: {
        userId: userIds.userId,
        otherUserId: userIds.otherUserId,
      },
    });
  }

  findFriendsInRange(params: {
    userId: string;
    offset: number;
    limit: number;
    distanceInMeters: number;
  }): Promise<User[]> {
    const { userId, distanceInMeters, offset, limit } = params;
    const query = `SELECT * FROM 
         (SELECT 
         *,
         ST_Distance(address, (SELECT address from "${UserEntity.tableName}" where id = $userId)) as distance 
         FROM  "${UserEntity.tableName}"
         WHERE id != $userId
         AND (
          id IN (SELECT "userId" from "${FriendEntity.tableName}" WHERE "otherUserId" = $userId)
          OR 
          id IN (SELECT "otherUserId" from "${FriendEntity.tableName}" WHERE "userId" = $userId)
         ))
        AS INNER_SELECT 
        WHERE distance IS NOT NULL 
        AND distance <= $maximumDistance
        OFFSET $offset
        LIMIT $limit`;

    const bind = { userId, maximumDistance: distanceInMeters, offset, limit };
    return this.sequelizeInstance.query(query, {
      bind,
      type: QueryTypes.SELECT,
    });
  }

  create(params: CreateFriendDto): Promise<Friend> {
    const userIds = FriendRepositoryPostgres.getOrderedUserIds(params);
    return FriendEntity.create(userIds).catch((err) => {
      if (err instanceof UniqueConstraintError) {
        throw new ErrorFriendAlreadyExists();
      }
      throw err;
    });
  }

  delete(params: {
    userId: string;
    otherUserId: string;
    transaction?: Transaction;
  }): Promise<boolean> {
    const userIds = FriendRepositoryPostgres.getOrderedUserIds(params);

    return FriendEntity.destroy({
      transaction: params.transaction,
      where: {
        userId: userIds.userId,
        otherUserId: userIds.otherUserId,
      },
    }).then((val) => val > 0);
  }
}
