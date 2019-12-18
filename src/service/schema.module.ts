import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { FollowsService } from './follows.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user/user.schema';
import { FollowsSchema } from './schema/follows/follows.schema';
const baseService = [
    UserService,
    FollowsService,
];
@Module({
    imports: [MongooseModule.forFeature([
        {name: 'User', schema: UserSchema},
        {name: 'Follows', schema: FollowsSchema},
    ])],
    providers: [...baseService],
    exports: [...baseService],
})

export class SchemaModule { }
