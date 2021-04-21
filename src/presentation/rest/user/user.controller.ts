import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from 'src/application/user/user.service';
import { FriendService } from '../../../application/friend/friend.service';
import { ApiQuery } from '@nestjs/swagger';
import { UserDTOTransformPipe } from './user.pipe';
import {
  CreateUserDtoPresentation,
  UpdateUserDtoPresentation,
} from './user.types';
import { UserAddressResponseInterceptor } from './user.interceptor';
import { CreateUserDto, UpdateUserDto } from '../../../domain/user/user.types';

@Controller('user')
@UseInterceptors(UserAddressResponseInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly friendService: FriendService,
  ) {}

  @Post()
  create(@Body(UserDTOTransformPipe) createUserDto: CreateUserDtoPresentation) {
    return this.userService.create(createUserDto as CreateUserDto);
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
    return this.userService.findAll({ offset, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneOrThrowException(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(UserDTOTransformPipe) updateUserDto: UpdateUserDtoPresentation,
  ) {
    return this.userService.update(id, updateUserDto as UpdateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
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
    return this.friendService.findFriendsInRange({
      userId: id,
      limit,
      offset,
      distanceInMeters: range,
    });
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
    return this.friendService.remove({ userId: id, otherUserId });
  }
}
