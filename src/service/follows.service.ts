import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../common/base.service';
import { Follows } from './schema/follows/follows.interface';
@Injectable()
export class FollowsService extends BaseService<Follows> {

    constructor(@InjectModel('Follows') private readonly followsModel: Model<Follows>) {
        super(followsModel);
    }
}
