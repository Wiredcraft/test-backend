import { Logger, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./user.controller";
import { User, UserSchema } from "./user.model";
import { UserService } from "./user.service";


@Module( {
	imports: [
		MongooseModule.forFeature( [ { name: User.name, schema: UserSchema } ] )
	],
	controllers: [
		UserController
	],
	providers: [ UserService, Logger ],
	exports: [ UserService ]
} )
export class UserModule {
}
