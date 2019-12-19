import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/user.schema";
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
