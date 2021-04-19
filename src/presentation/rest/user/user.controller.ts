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
import { CreateUserDto, UpdateUserDto } from 'src/domain/user/user.types';
import { FriendService } from '../../../application/friend/friend.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly friendService: FriendService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query('offset') offset = 0, @Query('limit') limit = 10) {
    return this.userService.findAll({ offset, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
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
    return this.friendService.findFriendsInRange({
      userId: id,
      limit,
      offset,
      distanceInMeters: range,
    });
  }

  @Post(':id/friends/:otherId')
  createFriend(@Param('id') id: string, @Param('otherId') otherId: string) {
    return this.friendService.create({ userId: id, otherUserId: otherId });
  }

  @Delete(':id/friends/:otherId')
  removeFriend(@Param('id') id: string, @Param('otherId') otherId: string) {
    return this.friendService.remove({ userId: id, otherUserId: otherId });
  }
}
