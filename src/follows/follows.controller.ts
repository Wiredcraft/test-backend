import { Controller, UseGuards, Post, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FollowsService } from './follows.service';
import { FollowDto } from '../dto/folllow.dto';
import { UserDec } from '../common/decorators/user.decorator';
import { User } from '../schema/user/user.interface';

@ApiUseTags('follows')
@Controller('follows')
@UseGuards(AuthGuard('jwt'))
export class FollowsController {

    constructor(private readonly followService: FollowsService) {}

    @Post('follow')
    @ApiBearerAuth()
    @ApiOperation({ title: 'follow user' })
    async followUser(@UserDec() user: User, @Body() body: FollowDto) {
        return await this.followService.addFollow(user, body.uid);
    }

    @Post('unfollow')
    @ApiBearerAuth()
    @ApiOperation({ title: 'unfollow user' })
    async unFollowUser(@UserDec() user: User, @Body() body: FollowDto) {
        return await this.followService.unFollow(user, body.uid);
    }

    @Get('followers')
    @ApiBearerAuth()
    @ApiOperation({ title: 'user followers' })
    async followers(@UserDec() user: User) {
        return await this.followService.followers(user);
    }
}
