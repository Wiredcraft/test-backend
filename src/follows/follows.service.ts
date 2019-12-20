import { Injectable, UseFilters, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseService } from '../common/base.service';
import { Follows } from '../schema/follows/follows.interface';
import { User } from '../schema/user/user.interface';
import { UserService } from '../user/user.service';
@Injectable()
export class FollowsService extends BaseService<Follows> {

    constructor(
        @InjectModel('Follows') private readonly followsModel: Model<Follows>,
        private readonly userService: UserService) {
        super(followsModel);
    }

    async addFollow(user: User, followId: string) {
        if (user.id === followId) {
            throw new UnauthorizedException('Follow yourself');
        }
        const follow = await this.userService.findById(followId);
        if (!follow) {
            throw new UnauthorizedException('User does not exists');
        }
        const exists = await this.findOne({ uid: Types.ObjectId(user.id), followId: Types.ObjectId(followId) });
        if (exists) {
            throw new UnauthorizedException('User had followed');
        }
        return await this.create({
            uid: Types.ObjectId(user.id),
            followId: Types.ObjectId(followId),
        });
    }

    async unFollow(user: User, followId: string) {
        const follow = await this.userService.findById(followId);
        if (!follow) {
            throw new UnauthorizedException('User does not exists');
        }
        const exists = await this.findOne(
            {
                uid: Types.ObjectId(user.id),
                followId: Types.ObjectId(followId),
            });
        if (!exists) {
            throw new UnauthorizedException('User did not followed');
        }
        return await this.remove({
            uid: Types.ObjectId(user.id),
            followId: Types.ObjectId(followId),
        });
    }

    async followers(user: User) {
        const users = await this.findAll({uid: user.id}, {password: 0}, {path: 'followId'});
        return users;
    }
}
