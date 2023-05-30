import { Provide, Inject, Controller, Post, Body, Del } from '@midwayjs/decorator';
import { Context } from '@midwayjs/web';
import { User } from '../entity/user';
import { Follow } from '../entity/follow';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectEntityModel } from '@midwayjs/typegoose';

@Provide()
@Controller('/user')
export class UserController {
  @Inject()
  ctx: Context;

  @InjectEntityModel(User)
  private userModel: ReturnModelType<typeof User>;

  @InjectEntityModel(Follow)
  private followModel: ReturnModelType<typeof Follow>;

  @Post('/follow')
  async follow( ctx: Context,@Body() body: { followerId: string, followingId: string }) {
    const { followerId, followingId } = body;

    const follower = await this.userModel.findById(followerId);
    const following = await this.userModel.findById(followingId);

    if (!follower || !following) {
      ctx.status = 404;
      return { message: 'User not found' };
    }

    const existingFollow = await this.followModel.findOne({ follower, following });

    if (existingFollow) {
      this.ctx.status = 400;
      return { message: 'Already following' };
    }

   

    await this.followModel.create({ follower, following }); // an "as" assertion, to have types for all properties

    follower.following.push(following);
    following.followers.push(follower);

    await follower.save();
    await following.save();


    ctx.helper.success({ message: 'Followed successfully' });
  }

  @Del('/unfollow')
  async unfollow( ctx: Context,@Body() body: { followerId: string, followingId: string }) {
    const { followerId, followingId } = body;

    const follower = await this.userModel.findById(followerId);
    const following = await this.userModel.findById(followingId);

    if (!follower || !following) {
      this.ctx.status = 404;
      return { message: 'User not found' };
    }

    const existingFollow = await this.followModel.findOne({ follower, following });

    if (!existingFollow) {
      this.ctx.status = 400;
      return { message: 'Not following' };
    }

    await existingFollow.remove();

    follower.following = follower.following.filter((user) => user.toString() !== followingId);
    following.followers = following.followers.filter((user) => user.toString() !== followerId);

    await follower.save();
    await following.save();

    ctx.helper.success({ message: 'Unfollowed successfully' });
  }
}
