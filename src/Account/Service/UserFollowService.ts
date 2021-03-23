import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../Schema/UserSchema';
import { Model } from 'mongoose';
import BusinessError from '../../Common/BusinessError';
import UserGeoService from './UserGeoService';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { UserFollow } from '../Schema/UserFollowSchema';
import { ErrorCode } from '../../ErrorCode';
import RedisKeys from '../../Common/RedisKeys';

@Injectable()
export default class UserFollowService {
  @InjectPinoLogger(UserFollowService.name)
  private readonly logger: PinoLogger;

  @Inject()
  private redisService: RedisService;

  @Inject()
  private userGeoService: UserGeoService;

  @InjectModel(User.name)
  private userModel: Model<User>;

  @InjectModel(UserFollow.name)
  private userFollowModel: Model<UserFollow>;

  @Inject()
  private configService: ConfigService;

  async follow(userId: string, targetId: string) {
    // find in cache
    const queryDbUser = [];
    if (
      await this.redisService.getClient().exists(RedisKeys.UserCache(userId))
    ) {
      queryDbUser.push(userId);
    }

    if (
      await this.redisService.getClient().exists(RedisKeys.UserCache(targetId))
    ) {
      queryDbUser.push(targetId);
    }

    if (queryDbUser.length > 0) {
      // find in db
      const users = await this.userModel
        .find(
          {
            _id: {
              $in: queryDbUser,
            },
          },
          { _id: 1 },
        )
        .limit(queryDbUser.length);
      if (users.length !== queryDbUser.length) {
        throw new BusinessError(
          HttpStatus.BAD_REQUEST,
          ErrorCode.ResourceNotExist,
          ['User', queryDbUser[0] === userId ? userId : targetId],
        );
      }
    }

    const followCache = await this.redisService
      .getClient()
      .zscore(RedisKeys.UserFollow(userId), targetId);
    if (followCache && followCache !== '') {
      return;
    }

    // TODO 优化为先写缓存再同步DB

    const createdAt = new Date();
    await this.userFollowModel.create({
      userId,
      targetId,
      createdAt,
    });

    await this.redisService
      .getClient()
      .zadd(RedisKeys.UserFollow(userId), createdAt.getTime(), targetId);

    const targetUserFansCount = await this.redisService
      .getClient()
      .zcard(RedisKeys.UserFans(targetId));

    if (
      targetUserFansCount >=
      this.configService.get<number>('app.relationship.maxFansCacheCount')
    ) {
      const last = await this.redisService
        .getClient()
        .zrangebyscore(
          RedisKeys.UserFans(userId),
          '-inf',
          '+inf',
          'LIMIT',
          0,
          1,
        );

      // remove last
      await this.redisService
        .getClient()
        .zrem(RedisKeys.UserFans(targetId), last);
    }

    await this.redisService
      .getClient()
      .zadd(RedisKeys.UserFans(targetId), createdAt.getTime(), userId);

    this.logger.info(`add ${userId} to ${targetId} fans list`);
    await this.redisService
      .getClient()
      .hincrby(RedisKeys.UserCache(userId), 'followCount', 1);

    await this.redisService
      .getClient()
      .hincrby(RedisKeys.UserCache(targetId), 'fansCount', 1);
  }

  async unFollowAll(userId: string) {
    const users = await this.userFollowModel.find(
      {
        userId: userId,
      },
      { targetId: 1 },
    );

    if (users.length === 0) {
      return;
    }

    await this.userFollowModel.deleteMany({ userId });

    // to mq task ↓
    // delete cache

    const pipeline = this.redisService.getClient().pipeline();
    pipeline.hincrby(RedisKeys.UserCache(userId), 'followCount', -users.length);

    for (const target of users) {
      pipeline.zrem(RedisKeys.UserFans(target.targetId), userId);
      pipeline.hincrby(RedisKeys.UserCache(target.targetId), 'fansCount', -1);
    }

    const res = await pipeline.exec();
    this.logger.info(`deleted all follow ${userId}`);
  }

  async unFollow(userId: string, targetId: string) {
    await this.userFollowModel.deleteOne({
      userId,
      targetId,
    });

    // delete cache

    // follow 有 maxFollow 限制, 删一个加一个理论上不存在一致性问题
    await this.redisService
      .getClient()
      .zrem(RedisKeys.UserFollow(userId), targetId);

    // 删除之后会导致空缺, 先检查数量, 不够就补一个
    // 如果恶性事件, 一堆人取关
    // 强业务相关, // todo

    // 先看看在不在缓存里面
    const remRes = await this.redisService
      .getClient()
      .zrem(RedisKeys.UserFans(targetId), userId);

    if (remRes !== 0) {
      const targetUserFansCount = await this.redisService
        .getClient()
        .zcard(RedisKeys.UserFans(targetId));
      if (
        targetUserFansCount <
        this.configService.get<number>('app.relationship.maxFansCacheCount')
      ) {
        await this.cacheFans(userId);
        this.logger.info(`refresh User ${targetId} fans list`);
      }
    }

    if (
      await this.redisService.getClient().exists(RedisKeys.UserCache(userId))
    ) {
      await this.redisService
        .getClient()
        .hincrby(RedisKeys.UserCache(userId), 'followCount', -1);
    }
    if (
      await this.redisService.getClient().exists(RedisKeys.UserCache(targetId))
    ) {
      await this.redisService
        .getClient()
        .hincrby(RedisKeys.UserCache(targetId), 'fansCount', -1);
    }

    this.logger.info(`deleted follow ${userId} to ${targetId}`);
  }

  async getFollowList(
    userId: string,
    offset = 0,
    limit = 10,
  ): Promise<string[]> {
    const follows = await this.redisService
      .getClient()
      .zrevrangebyscore(
        RedisKeys.UserFollow(userId),
        '+inf',
        '-inf',
        'LIMIT',
        offset,
        limit,
      );
    return follows;
  }

  async getFansList(userId: string, offset = 0, limit = 10): Promise<string[]> {
    const fans = await this.redisService
      .getClient()
      .zrevrangebyscore(
        RedisKeys.UserFans(userId),
        '+inf',
        '-inf',
        'LIMIT',
        offset,
        limit,
      );
    return fans;
  }

  async cacheFollow(userId: string) {
    const follow = await this.userFollowModel
      .find(
        {
          userId,
        },
        { _id: 1, createdAt: 1 },
      )
      .limit(
        this.configService.get<number>(
          'app.relationship.maxFollowCacheCount',
          20,
        ),
      );

    if (follow.length === 0) {
      this.logger.info(`cache user follow ${follow.length}`);
      return;
    }

    const cmds = [];

    for (const record of follow) {
      cmds.push(record.createdAt.getTime());
      cmds.push(record._id);
    }

    await this.redisService.getClient().del(RedisKeys.UserFollow(userId));
    await this.redisService
      .getClient()
      .zadd(RedisKeys.UserFollow(userId), cmds);

    this.logger.info(`cache user fans ${follow.length}`);
  }

  async cacheFans(userId: string) {
    // +20 的额外缓存
    const fans = await this.userFollowModel
      .find(
        {
          targetId: userId,
        },
        { _id: 1, createdAt: 1 },
      )
      .limit(
        this.configService.get<number>(
          'app.relationship.maxFansCacheCount',
          20,
        ) + 20,
      );

    if (fans.length === 0) {
      this.logger.info(`cache user fans ${fans.length}`);
      return;
    }

    const cmds = [];

    for (const record of fans) {
      cmds.push(record._id);
      cmds.push(record.createdAt.getTime());
    }

    await this.redisService.getClient().del(RedisKeys.UserFans(userId));
    await this.redisService.getClient().zadd(RedisKeys.UserFans(userId), cmds);

    this.logger.info(`cache user fans ${fans.length}`);
  }

  async cacheRelationship(userId: string) {
    // to mq task
    await Promise.all([this.cacheFans(userId), this.cacheFollow(userId)]);
    this.logger.info(`user relationship cache over`);
  }

  async getFollowCount(userId: string): Promise<number> {
    const followRes = await this.redisService
      .getClient()
      .hmget(RedisKeys.UserCache(userId), 'followCount');

    const [follow] = followRes;
    if (follow !== null) {
      return parseInt(follow, 0);
    }
    return this.userFollowModel.count({ userId });
  }

  async getFansCount(targetId: string): Promise<number> {
    const fansRes = await this.redisService
      .getClient()
      .hmget(RedisKeys.UserCache(targetId), 'fansCount');

    const [fans] = fansRes;
    if (fans !== null) {
      return parseInt(fans, 0);
    }
    return this.userFollowModel.count({ targetId });
  }
}
