import {
  Bind,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { UserId, UserAppService } from '../application/user.service';
import { UserDto, UserWithIdDto } from './user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserNotFoundExceptionFilter } from './user.filter';

const CONTEXT = 'UserController';

@ApiTags('users')
@Controller('/users')
@UseFilters(new UserNotFoundExceptionFilter())
export class UserController {
  constructor(private readonly userAppService: UserAppService) {}

  @Get()
  @ApiOperation({
    summary: 'List all users registered to the system',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully listed.',
  })
  async listUser(): Promise<UserWithIdDto[]> {
    Logger.debug(`listUser...`, CONTEXT);
    // TODO handle as stream
    const result = await this.userAppService.listUser().then((iter) => {
      return Array.from(iter);
    });
    Logger.debug(`listUser finished`, CONTEXT);
    return result;
  }

  @Get(':id')
  @Bind(Param('id'))
  @ApiOperation({
    summary: 'Get a user with the specified UserID',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully found.',
  })
  @ApiResponse({ status: 404, description: 'The record has not been found.' })
  async findUser(id: UserId): Promise<UserWithIdDto> {
    Logger.debug(`findUser with UserId ${id}...`, CONTEXT);
    const result = await this.userAppService.getUser(id);
    Logger.debug(`findUser finished with UserId ${id}`, CONTEXT);
    return result;
  }

  @Post()
  @Bind(Body())
  @ApiOperation({
    summary: 'Create a user with specified properties',
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  createUser(user: UserDto): Promise<UserWithIdDto> {
    Logger.debug(`createUser with ${user}...`, CONTEXT);
    return this.userAppService.createUser(user).then((created) => {
      Logger.debug(`createUser finished with ${user}`, CONTEXT);
      return created;
    });
  }

  @Put(':id')
  @Bind(Param('id'), Body())
  @ApiOperation({
    summary: 'Update the user with the specified properties',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'The record has not been found.' })
  async updateUser(id: string, user: UserDto): Promise<UserWithIdDto> {
    const updated = { ...user, id };
    Logger.debug(`updateUser with user ${updated}...`, CONTEXT);
    await this.userAppService.updateUser(updated);
    Logger.debug(`updateUser finished with user ${updated}`, CONTEXT);
    return updated;
  }

  @Delete(':id')
  @Bind(Param('id'))
  @ApiOperation({
    summary: 'Delete the user with the specified UserID',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'The record has not been found.' })
  async deleteUser(id: UserId) {
    Logger.debug(`deleteUser with UserId ${id}...`, CONTEXT);
    await this.userAppService.deleteUser(id);
    Logger.debug(`deleteUser finished with UserId ${id}`, CONTEXT);
  }
}
