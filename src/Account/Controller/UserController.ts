import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import UserService from '../Service/UserService';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import ObjectIdValidationPipe from '../../Common/Pipe/ObjectIdValidationPipe';
import UserGeoService from '../Service/UserGeoService';
import SwaggerBadRequestResponse from '../../Common/SwaggerBadRequestResponse';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserGeoInfoDto,
} from './Dto/UserControllerDto';
import {
  CreateUserResponse,
  GetUserGeoInfoResponse,
  GetUserNearByFriendResponse,
} from './Response/UserControllerResponse';

@ApiTags('User Service')
@Controller('/user')
export default class UserController {
  @Inject() private useService: UserService;
  @Inject() private userGeoService: UserGeoService;

  @ApiOperation({
    description: 'Create New User',
    summary: 'Create User',
  })
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'succeeded create user',
    type: CreateUserResponse,
  })
  @ApiBadRequestResponse(SwaggerBadRequestResponse())
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.useService.createUser(createUserDto);
  }

  @ApiOperation({
    description: 'Delete User',
    summary: 'Delete User',
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse(SwaggerBadRequestResponse())
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  public deleteUser(@Param('id', new ObjectIdValidationPipe()) id: string) {
    return this.useService.deleteUserWithId(id);
  }

  @ApiOperation({
    description: 'Get User Data',
    summary: 'Get User Data',
  })
  @ApiBadRequestResponse(SwaggerBadRequestResponse())
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  public getUser(@Param('id', new ObjectIdValidationPipe()) id: string) {
    return this.useService.getUserWithId(id);
  }

  @ApiOperation({
    description: 'Update User Data',
    summary: 'Update User Data',
  })
  @ApiBadRequestResponse(SwaggerBadRequestResponse())
  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  public updateUserBaseInfo(
    @Param('id', new ObjectIdValidationPipe()) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.useService.updateUser(userId, updateUserDto);
  }

  @ApiOperation({
    description: 'Update User Geo Data',
    summary: 'Update User Geo Data',
  })
  @ApiBadRequestResponse(SwaggerBadRequestResponse())
  @HttpCode(HttpStatus.OK)
  @Patch('/:id/geo')
  public updateUserGeoInfo(
    @Param('id', new ObjectIdValidationPipe()) id: string,
    @Body() updateUserGeoInfoDto: UpdateUserGeoInfoDto,
  ) {
    return this.userGeoService.updateUserGeoInfo(id, updateUserGeoInfoDto);
  }

  @ApiOperation({
    description: 'get geo info',
    summary: 'Get User Geo info',
  })
  @ApiOkResponse({
    description: 'ok',
    type: GetUserGeoInfoResponse,
  })
  @ApiBadRequestResponse(SwaggerBadRequestResponse())
  @Get('/:id/geo')
  async getUserGeoInfo(@Param('id', new ObjectIdValidationPipe()) id: string) {
    return this.userGeoService.getGeoInfoWithId(id);
  }

  @ApiOperation({
    summary: 'Get NearBy Friend',
  })
  @ApiOkResponse({
    type: GetUserNearByFriendResponse,
  })
  @ApiBadRequestResponse(SwaggerBadRequestResponse())
  @Get('/:id/nearby')
  async get(@Param('id', new ObjectIdValidationPipe()) userId: string) {
    const users = await this.userGeoService.getNearByUser(userId, 20, 20);
    const list = [];
    for (const user of users) {
      const u = await this.useService.getUserWithId(userId);
      // 精度不够先用 cache 的
      list.push({
        name: u.name,
        description: u.description,
        longitude: u.longitude,
        latitude: u.latitude,
        distance: user.distance,
        unit: user.unit,
      });
    }
    return list;
  }
}
