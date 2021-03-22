import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import UserFollowService from '../Service/UserFollowService';
import ObjectIdValidationPipe from '../../Common/Pipe/ObjectIdValidationPipe';
import SwaggerBadRequestResponse from '../../Common/SwaggerBadRequestResponse';
import { ConfigService } from '@nestjs/config';
import BusinessError from '../../Common/BusinessError';
import { ErrorCode } from '../../ErrorCode';
import UserService from '../Service/UserService';
import { GetFollowListResponse } from './Response/UserRelationshipResponse';
import { CreateFollowDto } from './Dto/UserRelationshipControllerDto';

@ApiTags('User Service')
@Controller('/user')
export default class UserRelationshipController {
  @Inject()
  private userFollowService: UserFollowService;

  @Inject()
  private configService: ConfigService;

  @Inject(forwardRef(() => UserService))
  private userService: UserService;

  @ApiOperation({
    summary: 'Create Follow',
    description: 'create follow',
  })
  @ApiCreatedResponse({
    description: 'created',
  })
  @ApiBadRequestResponse(SwaggerBadRequestResponse())
  @HttpCode(HttpStatus.CREATED)
  @Put('/:id/follow')
  async follow(
    @Param('id', new ObjectIdValidationPipe()) id: string,
    @Body() createFollowDto: CreateFollowDto,
  ) {
    return this.userFollowService.follow(id, createFollowDto.targetId);
  }

  @ApiOperation({
    summary: 'Delete Follow',
    description: 'delete follow',
  })
  @ApiNoContentResponse({
    description: 'deleted',
  })
  @ApiBadRequestResponse(SwaggerBadRequestResponse())
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:userId/follow/:targetId')
  async unFollow(
    @Param('userId', new ObjectIdValidationPipe()) userId: string,
    @Param('targetId', new ObjectIdValidationPipe()) targetId: string,
  ) {
    return this.userFollowService.unFollow(userId, targetId);
  }

  @ApiOperation({
    summary: 'Get Follow List',
  })
  @ApiOkResponse({
    type: GetFollowListResponse,
  })
  @ApiBadRequestResponse(SwaggerBadRequestResponse())
  @Get('/:userId/follow')
  async getFollow(
    @Param('userId', new ObjectIdValidationPipe()) userId: string,
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    if (
      limit > this.configService.get<number>('app.relationship.maxQueryLimit')
    ) {
      throw new BusinessError(HttpStatus.BAD_REQUEST, ErrorCode.ParamError);
    }

    const users = await this.userFollowService.getFollowList(
      userId,
      offset,
      limit,
    );

    const list = [];

    for (const user of users) {
      const cache = await this.userService.getUserWithId(user);
      list.push({
        name: cache.name,
        description: cache.description,
        id: user,
      });
    }

    return {
      list,
      count: await this.userFollowService.getFollowCount(userId),
    };
  }

  @ApiOperation({
    summary: 'Get Fans List',
  })
  @ApiOkResponse({
    type: GetFollowListResponse,
  })
  @ApiBadRequestResponse(SwaggerBadRequestResponse())
  @Get('/:userId/fans')
  async getFans(
    @Param('userId', new ObjectIdValidationPipe()) userId: string,
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    if (
      limit > this.configService.get<number>('app.relationship.maxQueryLimit')
    ) {
      throw new BusinessError(HttpStatus.BAD_REQUEST, ErrorCode.ParamError);
    }

    const users = await this.userFollowService.getFansList(
      userId,
      offset,
      limit,
    );

    const list = [];

    for (const user of users) {
      const cache = await this.userService.getUserWithId(user);
      list.push({
        name: cache.name,
        description: cache.description,
        id: user,
      });
    }

    return {
      list,
      count: await this.userFollowService.getFansCount(userId),
    };
  }
}
