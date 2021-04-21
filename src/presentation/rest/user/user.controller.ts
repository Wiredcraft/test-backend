import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from 'src/application/user/user.service';
import { FriendService } from '../../../application/friend/friend.service';
import { CreateUserDto, UpdateUserDto } from './user.types';
import { GeoPosition } from '../../../domain/address.type';
import { User } from 'src/domain/user/user.types';
import { ApiQuery } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly friendService: FriendService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService
      .create({
        ...createUserDto,
        address: this.transformLatLongToGeoPosition(
          createUserDto.address,
        ),
      })
      .then((res) => this.mapUserAddressToOutside(res));
  }

  @ApiQuery({
    name: 'offset',
    type: 'number',
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    example: 10,
    required: false,
  })
  @Get()
  findAll(@Query('offset') offset = 0, @Query('limit') limit = 10) {
    return this.userService
      .findAll({ offset, limit })
      .then((users) => users.map(this.mapUserAddressToOutside));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService
      .findOne(id)
      .then((res) => this.mapUserAddressToOutside(res))
      .then((res) => {
        if (!res) {
          throw new HttpException('User not found', 404);
        }
        return res;
      });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, {
      ...updateUserDto,
      address: this.transformLatLongToGeoPosition(
        updateUserDto.address,
      ),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id).then((res) => {
      if (!res) {
        throw new HttpException('User not found', 404);
      }
    });
  }

  @ApiQuery({
    name: 'offset',
    type: 'number',
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    example: 10,
    required: false,
  })
  @Get(':id/friend')
  getFriends(
    @Param('id') id: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
  ) {
    return this.friendService.findByUserId({ userId: id, limit, offset });
  }

  @ApiQuery({
    name: 'range',
    type: 'number',
    example: 5000,
    description: 'Range in meters',
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    type: 'number',
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    example: 10,
    required: false,
  })
  @Get(':id/friend/nearby')
  getFriendsInRange(
    @Param('id') id: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
    @Query('range') range = 5000,
  ) {
    return this.friendService
      .findFriendsInRange({
        userId: id,
        limit,
        offset,
        distanceInMeters: range,
      })
      .then((res) => res.map(this.mapUserAddressToOutside));
  }

  @Post(':id/friend/:otherUserId')
  createFriend(
    @Param('id') id: string,
    @Param('otherUserId') otherUserId: string,
  ) {
    return this.friendService.create({ userId: id, otherUserId });
  }

  @Delete(':id/friend/:otherUserId')
  removeFriend(
    @Param('id') id: string,
    @Param('otherUserId') otherUserId: string,
  ) {
    return this.friendService
      .remove({ userId: id, otherUserId })
      .then((res) => {
        if (!res) {
          throw new HttpException('User not found', 404);
        }
      });
  }

  // Transforms lat/long to long/lat for GeoPosition, used to display points in the application
  private transformLatLongToGeoPosition = (
    address: number[],
  ): GeoPosition => {
    if (address && address.length > 1) {
      return {
        type: 'Point',
        coordinates: [address[1], address[0]],
      };
    }
    return undefined;
  };

  // Transforms long/lat to lat/long
  private transformGeoPositionToAddress = (address: GeoPosition): number[] => {
    if (address) {
      return [address.coordinates[1], address.coordinates[0]];
    }
    return undefined;
  };

  // Accept address as lat/lon, which is commonly used and standardised (https://epsg.io/4326)
  private mapUserAddressToOutside = (user: User) => {
    if (user && user.address) {
      return {
        ...user,
        address: this.transformGeoPositionToAddress(user.address),
      };
    }
    return user;
  };
}
