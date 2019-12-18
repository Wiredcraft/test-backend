import { BaseService } from '../common/base.service';
import { User } from './schema/user/user.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class UserService extends BaseService<User> {

    constructor(@InjectModel('User') private readonly userModel: Model<User>) {
        super(userModel);
    }
}
