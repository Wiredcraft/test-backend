import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/user.schema";
import { UserService } from "./users.service";
import { UserController } from "./users.controller";
import { UserFollowSchema } from "./schemas/user-follow.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'UserFollow', schema: UserFollowSchema }])],
    controllers: [UserController],
    providers: [UserService]
})
export class UsersModule { }