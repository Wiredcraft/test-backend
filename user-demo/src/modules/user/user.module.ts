import { Module } from '@nestjs/common';
import { MongooseModule } from  '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { UserController } from '../../controller/user/user.controller';
import { UserService } from '../../services/user/user.service';


@Module({
    // TODO: key createAt use mongoose "pre('save')" method.
    imports:[ MongooseModule.forFeature([{name: User.name, schema: UserSchema}]) ],
    controllers:[UserController],
    providers:[UserService]
})
export class UserModule {
    
}
