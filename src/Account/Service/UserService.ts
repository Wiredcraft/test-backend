import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../Schema/UserSchema';
import { Model, Types } from 'mongoose';
import { ErrorCode } from '../../ErrorCode';
import BusinessError from '../../Common/BusinessError';
import UserGeoService from './UserGeoService';
import * as moment from 'moment';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import RedisKeys from '../../Common/RedisKeys';
import { ConfigService } from '@nestjs/config';
import UserFollowService from './UserFollowService';
import {
  CreateUserDto,
  UpdateUserDto,
} from '../Controller/Dto/UserControllerDto';

export interface IUserCache {
  id: string;
  name: string;
  description: string;
  longitude: number;
  latitude: number;
  fansCount: number;
  followCount: number;
  address: string;
  dob: Date;
}

export interface IUserCacheRaw {
  id: string;
  name: string;
  description: string;
  longitude: string;
  latitude: string;
  fansCount: string;
  followCount: string;
  address: string;
  dob: string;
}

@Injectable()
export default class UserService {
  @InjectPinoLogger(UserService.name)
  private readonly logger: PinoLogger;

  @Inject()
  private redisService: RedisService;

  @Inject()
  private userGeoService: UserGeoService;

  @InjectModel(User.name)
  private userModel: Model<User>;

  @Inject()
  private configService: ConfigService;

  @Inject()
  private userFollowService: UserFollowService;

  /**
   * delete user with userId
   * @param userId
   */
  public async deleteUserWithId(userId: string) {
    // user exist ?
    if (!(await this.userModel.exists({ _id: userId }))) {
      throw new BusinessError(
        HttpStatus.BAD_REQUEST,
        ErrorCode.ResourceNotExist,
        ['User', userId],
      );
    }

    // delete database record
    await this.userModel.deleteOne({ _id: userId });
    this.logger.info(`user ${userId} data deleted`);

    // delete redis geo cache
    await this.userGeoService.deleteGeoInfo(userId);
    // delete follow
    await this.userFollowService.unFollowAll(userId);
  }

  /**
   * Create User
   * @param createUserDto
   */
  public async createUser(createUserDto: CreateUserDto) {
    const user = ((await this.userModel.updateOne(
      {
        name: createUserDto.name,
      },
      {
        $setOnInsert: {
          name: createUserDto.name,
          dob: createUserDto.dob,
          description: createUserDto.description,
          address: createUserDto.address,
          createdAt: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
      },
    )) as unknown) as {
      upserted: { index: number; _id: Types.ObjectId }[];
      n: number;
    };

    if (user.n === 1 && user.upserted?.length === 1) {
      const userId = user.upserted[0]._id.toString();
      await this.cacheUser(userId);
      return {
        id: user.upserted[0]._id.toString(),
      };
    }

    if (user.n === 1 && !user.upserted) {
      throw new BusinessError(HttpStatus.BAD_REQUEST, ErrorCode.ResourceExist, [
        'User',
        createUserDto.name,
      ]);
    }

    this.logger.error(`User ${createUserDto.name} create fail`, user);
    throw new BusinessError(HttpStatus.BAD_REQUEST, ErrorCode.UNKNOWN);
  }

  public async cacheUser(id: string);
  public async cacheUser(user: User);
  public async cacheUser(arg: string | User): Promise<null | User> {
    let userId: string;
    let user: User;
    if (typeof arg === 'string') {
      userId = arg;
      user = await this.userModel.findById(userId);
    } else {
      userId = arg._id;
      user = arg;
    }

    if (!user) {
      return null;
    }
    const cmds = [];
    const userCache = user.toJSON();
    Object.keys(userCache).forEach((key) => {
      cmds.push(key);
      cmds.push(userCache[key]);
    });

    cmds.push('fansCount');
    cmds.push(await this.userFollowService.getFansCount(userId));
    cmds.push('followCount');
    cmds.push(await this.userFollowService.getFollowCount(userId));

    await this.redisService
      .getClient()
      .hmset(
        RedisKeys.UserCache(user._id),
        cmds,
        'EX',
        this.configService.get<number>('app.userCache.defaultExpire', 3600 * 7),
      );
    return user;
  }

  public async getUserWithId(userId: string): Promise<IUserCache> {
    const userCache = ((await this.redisService
      .getClient()
      .hgetall(RedisKeys.UserCache(userId))) as unknown) as IUserCacheRaw;

    if (Object.keys(userCache).length > 5) {
      return {
        ...userCache,
        fansCount: parseInt(userCache.fansCount, 10),
        followCount: parseInt(userCache.followCount, 10),
        longitude: parseInt(userCache.longitude, 10),
        latitude: parseInt(userCache.latitude, 10),
        dob: new Date(userCache.dob),
      };
    }

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BusinessError(
        HttpStatus.NOT_FOUND,
        ErrorCode.ResourceNotExist,
        ['User', userId],
      );
    }

    await this.cacheUser(user);
    return (user.toJSON() as unknown) as IUserCache;
  }

  public async updateUser(
    userId: string,
    updateUserDto: Partial<User> | Partial<UpdateUserDto>,
  ) {

    if (!(await this.userModel.exists({ _id: userId }))) {
      throw new BusinessError(
        HttpStatus.BAD_REQUEST,
        ErrorCode.ResourceNotExist,
        ['User', userId],
      );
    }

    if (await this.userModel.exists({ name: updateUserDto.name })) {
      throw new BusinessError(HttpStatus.BAD_REQUEST, ErrorCode.ResourceExist, [
        'User name',
        updateUserDto.name,
      ]);
    }

    await this.userModel.findByIdAndUpdate(userId, {
      $set: updateUserDto as any,
    });
    await this.cacheUser(userId);
    await this.userFollowService.cacheRelationship(userId);
  }
}
