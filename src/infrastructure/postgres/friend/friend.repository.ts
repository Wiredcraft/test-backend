import { Inject, Injectable } from '@nestjs/common';
import { FriendRepository } from '../../../domain/friend/friend.repository';
import { CreateFriendDto, Friend } from 'src/domain/friend/friend.types';
import { FriendEntity } from './friend.entity';
import { Op, QueryTypes, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UserEntity } from '../user/user.entity';
import { User } from 'src/domain/user/user.types';

@Injectable()
export class FriendRepositoryPostgres implements FriendRepository {
  constructor(
    @Inject('SEQUELIZE') private readonly sequelizeInstance: Sequelize,
  ) {}

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
    return FriendEntity.findOne({
      transaction: params.transaction,
      where: {
        [Op.or]: [
          {
            userId: params.userId,
            otherUserId: params.otherUserId,
          },
          {
            userId: params.otherUserId,
            otherUserId: params.userId,
          },
        ],
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
         AND (id IN (SELECT "userId" from "${FriendEntity.tableName}" WHERE "otherUserId" = $userId)
         
         ) OR id IN (SELECT "otherUserId" from "${FriendEntity.tableName}" WHERE "userId" = $userId)
         
         ) 
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
    return this.sequelizeInstance.transaction(async (transaction) => {
      const friend = await this.findByUserIds({ ...params, transaction });
      if (!friend) {
        return FriendEntity.create(params, { transaction });
      }
      throw new Error('Friend already exists');
    });
  }

  delete(params: {
    userId: string;
    otherUserId: string;
    transaction?: Transaction;
  }): Promise<boolean> {
    return FriendEntity.destroy({
      transaction: params.transaction,
      where: {
        [Op.or]: [
          {
            userId: params.userId,
            otherUserId: params.otherUserId,
          },
          {
            userId: params.otherUserId,
            otherUserId: params.userId,
          },
        ],
      },
    }).then((val) => val > 0);
  }
}
