import { Logger, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "./config/config.module";
import { MongoConfig } from "./config/mongo.config";
import { HealthcheckController } from "./modules/healthcheck/healthcheck.controller";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";


@Module( {
	imports: [
		AuthModule,
		ConfigModule,
		UserModule,
		MongooseModule.forRootAsync( { useClass: MongoConfig } )
	],
	controllers: [ HealthcheckController ],
	providers: [ Logger ]
} )
export class AppModule {
}
