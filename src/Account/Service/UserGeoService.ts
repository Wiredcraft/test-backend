import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../Schema/UserSchema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { RedisFixGeoRadiusByMember } from '../../Common/RedisTypingFix';
import RedisKeys from '../../Common/RedisKeys';
import BusinessError from '../../Common/BusinessError';
import { ErrorCode } from '../../ErrorCode';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import UserService from './UserService';
import {UpdateUserGeoInfoDto} from "../Controller/Dto/UserControllerDto";

@Injectable()
export default class UserGeoService {
  @InjectPinoLogger(UserGeoService.name)
  private readonly logger: PinoLogger;

  @Inject()
  private redisService: RedisService;

  @Inject()
  private configService: ConfigService;

  @Inject(forwardRef(() => UserService))
  private userService: UserService;

  @InjectModel(User.name)
  private userModel: Model<User>;

  public async updateUserGeoInfo(
    id: string,
    updateUserGeoInfoDto: UpdateUserGeoInfoDto,
  ) {
    // save new geo info to db
    await this.userModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          longitude: updateUserGeoInfoDto.longitude,
          latitude: updateUserGeoInfoDto.latitude,
        },
      },
    );

    // save geo info to redis cache
    await this.redisService
      .getClient()
      .geoadd(
        RedisKeys.UserGeoRange(),
        updateUserGeoInfoDto.longitude,
        updateUserGeoInfoDto.latitude,
        id,
      );

    // update cache
    await this.redisService
      .getClient()
      .hmset(
        RedisKeys.UserCache(id),
        'longitude',
        updateUserGeoInfoDto.longitude,
        'latitude',
        updateUserGeoInfoDto.latitude,
      );
  }

  public async getNearByUser(
    userId: string,
    radius: number,
    count: number,
  ): Promise<
    {
      id: string;
      longitude: number;
      latitude: number;
      distance: number;
      unit: 'km' | 'm' | string;
    }[]
  > {
    const maxRadius = this.configService.get<number>(
      'app.geo.search.maxRadius',
    );

    const maxCount = this.configService.get<number>('app.geo.search.maxCount');
    // search user
    const member = await (this.redisService.getClient()
      .georadiusbymember as RedisFixGeoRadiusByMember)(
      RedisKeys.UserGeoRange(),
      userId,
      Math.min(radius, maxRadius),
      this.configService.get<'km' | 'm'>('app.geo.search.unit', 'm'),
      'COUNT',
      Math.min(count, maxCount),
      'WITHCOORD',
      'WITHDIST',
    );

    const list = [] as {
      id: string;
      longitude: number;
      latitude: number;
      distance: number;
      unit: 'km' | 'm' | string;
    }[];

    for (const pos of member) {
      const [id, distance, geo] = pos;
      if (id === userId) {
        continue;
      }

      const [longitude, latitude] = geo;
      list.push({
        id,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
        distance: parseFloat(distance),
        unit: this.configService.get<'km' | 'm'>('app.geo.search.unit', 'm'),
      });
    }
    return list;
  }

  public async deleteGeoInfo(id: string) {
    await this.redisService.getClient().zrem(RedisKeys.UserGeoRange(), id);
    this.logger.info(`delete ${id} geo info`);
  }

  public async getGeoInfoWithId(id: string) {
    // find user cache
    const userCache = await this.redisService
      .getClient()
      .hmget(RedisKeys.UserCache(id), 'longitude', 'latitude');

    if (userCache) {
      return {
        longitude: parseFloat(userCache[0]),
        latitude: parseFloat(userCache[1]),
      };
    }

    // // find geo cache
    // const geoCache = await this.redisService
    //   .getClient()
    //   .geopos(RedisKeys.UserGeoRange(), id);
    //
    // // geohash accuracy ?
    // if (geoCache && geoCache.length > 0 && geoCache[0]) {
    //   return {
    //     longitude: parseFloat(geoCache[0][0]),
    //     latitude: parseFloat(geoCache[0][1]),
    //   };
    // }

    // // find db
    // const userGeo = await this.userModel.findOne(
    //   {
    //     _id: id,
    //   },
    //   {
    //     longitude: true,
    //     latitude: true,
    //   },
    // );
    //
    // if (!userGeo) {
    //   throw new BusinessError(HttpStatus.NOT_FOUND, ErrorCode.ResourceNotExist);
    // }

    const user = await this.userService.cacheUser(id);

    if (user) {
      // save to cache
      await this.redisService
        .getClient()
        .geoadd(RedisKeys.UserGeoRange(), user.longitude, user.latitude, id);

      return {
        longitude: user.longitude,
        latitude: user.latitude,
      };
    }
    throw new BusinessError(HttpStatus.NOT_FOUND, ErrorCode.ResourceNotExist);
  }
}
