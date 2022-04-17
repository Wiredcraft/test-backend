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
  HttpCode,
} from '@nestjs/common';
import { stripUndefined } from '../util/object';
import {
  GetUsersDto,
  RegisterUserDto,
  UpdateUserDto,
  LoginDto,
  LoginResult,
  UnauthorizedDto,
  ForbiddenDto,
  NotFoundDto
} from './user.dto';
import { UserService } from './user.service';
import { ApiOkResponse, ApiBody, ApiParam, ApiHeaders, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { User } from './user.schema';
import { LocalGuard } from './auth.strategy';

@Controller('/api/v1/users')
export class UserController {
  constructor(protected readonly service: UserService) {}
  @ApiOkResponse({ type: User })
  @Get('')
  @HttpCode(200)
  async getUsers(@Query() query: GetUsersDto) {
    const { take, skip, name } = query;

    return this.service.find(stripUndefined({ name }), take, skip);
  }

  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse({ type: NotFoundDto })
  @Get('/:id')
  @HttpCode(200)
  async getUserById(@Param('id') id: string) {
    return this.service.getOneOrFailed({ _id: id });
  }

  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: User })
  @UseGuards(LocalGuard)
  @ApiHeaders([{ name: 'Authorization', required: true }])
  @ApiNotFoundResponse({ type: NotFoundDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  @Put('/:id')
  @HttpCode(200)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserBody: UpdateUserDto,
  ) {
    return this.service.updateById(id, updateUserBody);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete('/:id')
  @UseGuards(LocalGuard)
  @ApiNotFoundResponse({ type: NotFoundDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  @ApiHeaders([{ name: 'Authorization', required: true }])
  @HttpCode(200)
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
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @Post('/login')
  @HttpCode(200)
  async login(@Request() req) {
    return this.service.login(req.user);
  }
}
