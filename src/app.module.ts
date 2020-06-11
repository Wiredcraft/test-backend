import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { ConfigModule } from "./config/config.module";
import { MongoConfig } from "./config/mongo.config";


@Module( {
	imports: [
		ConfigModule,
		MongooseModule.forRootAsync( { useClass: MongoConfig } )
	],
	controllers: [ AppController ]
} )
export class AppModule {
}
