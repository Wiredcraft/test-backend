import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "./config/config.module";


@Module( {
	imports: [
		ConfigModule
	],
	controllers: [ AppController ]
} )
export class AppModule {
}
