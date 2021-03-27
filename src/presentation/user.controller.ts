import {
  Bind,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { UserId, UserAppService } from '../application/user.service';
import { UserDto, UserWithIdDto } from './user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserNotFoundExceptionFilter } from './user.filter';
@ApiTags('users')
@Controller('/users')
@UseFilters(new UserNotFoundExceptionFilter())
export class UserController {
  constructor(private readonly UserAppService: UserAppService) {}

  @Get()
  @ApiOperation({
    summary: 'List all users registered to the system',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully listed.',
  })
  async listUser(): Promise<UserWithIdDto[]> {
    // TODO handle as stream
    return Array.from(await this.UserAppService.listUser());
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
    return await this.UserAppService.getUser(id);
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
    return this.UserAppService.createUser(user);
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
    await this.UserAppService.updateUser(updated);
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
    await this.UserAppService.deleteUser(id);
  }
}
