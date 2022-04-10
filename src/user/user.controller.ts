import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { stripUndefined } from '../util/object';
import {
  GetUsersDto,
  RegisterUserDto,
  UpdateUserDto,
  LoginDto,
  LoginResult,
} from './user.dto';
import { UserService } from './user.service';
import { ApiOkResponse, ApiBody, ApiParam, ApiHeaders } from '@nestjs/swagger';
import { User } from './user.schema';
import { LocalGuard } from './auth.strategy';

@Controller('/api/v1/users')
export class UserController {
  constructor(protected readonly service: UserService) {}
  @ApiOkResponse({ type: User })
  @Get('')
  async getUsers(@Query() query: GetUsersDto) {
    const { take, skip, name } = query;

    return this.service.find(stripUndefined({ name }), take, skip);
  }

  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: User })
  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    return this.service.getOneOrFailed({ _id: id });
  }

  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: User })
  @UseGuards(LocalGuard)
  @ApiHeaders([{ name: 'Authorization', required: true }])
  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserBody: UpdateUserDto,
  ) {
    return this.service.updateById(id, updateUserBody);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete('/:id')
  @UseGuards(LocalGuard)
  @ApiHeaders([{ name: 'Authorization', required: true }])
  async DeleteUser(@Param('id') id: string) {
    return this.service.deleteById(id);
  }

  @ApiBody({ type: RegisterUserDto })
  @ApiOkResponse({ type: User })
  @Post('/register')
  async register(@Body() registerBody: RegisterUserDto) {
    return this.service.register(registerBody);
  }

  @ApiBody({
    type: LoginDto,
  })
  @ApiOkResponse({ type: LoginResult })
  @UseGuards(LocalGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.service.login(req.user);
  }
}
