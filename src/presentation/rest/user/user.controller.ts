import {
  Body,
  Controller,
  Delete,
  Get,
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
        address: this.transformLatLongToPostgresGeoPosition(
          createUserDto.address,
        ),
      })
      .then((res) => this.mapUserAddressToOutside(res));
  }

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
      .then((res) => this.mapUserAddressToOutside(res));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, {
      ...updateUserDto,
      address: this.transformLatLongToPostgresGeoPosition(
        updateUserDto.address,
      ),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get(':id/friends')
  getFriends(
    @Param('id') id: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
  ) {
    return this.friendService.findByUserId({ userId: id, limit, offset });
  }

  @Get(':id/friends/nearby')
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

  @Post(':id/friends/:otherId')
  createFriend(@Param('id') id: string, @Param('otherId') otherId: string) {
    return this.friendService.create({ userId: id, otherUserId: otherId });
  }

  @Delete(':id/friends/:otherId')
  removeFriend(@Param('id') id: string, @Param('otherId') otherId: string) {
    return this.friendService.remove({ userId: id, otherUserId: otherId });
  }

  private transformLatLongToPostgresGeoPosition = (
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

  private transformGeoPositionToAddress = (address: GeoPosition): number[] => {
    if (address) {
      return [address.coordinates[1], address.coordinates[0]];
    }
    return undefined;
  };

  // Accept address as lat/lon, which is commonly used for
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
