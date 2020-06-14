import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { WinstonModule } from "nest-winston";
import { AppModule } from "./app.module";
import LogConfig from "./config/log.config";

async function bootstrap() {
	const app = await NestFactory.create( AppModule, {
		logger: WinstonModule.createLogger( LogConfig() )
	} );

	// Add Middleware
	app.useGlobalPipes( new ValidationPipe( {
		whitelist: true,
		transform: true
	} ) );

	await app.listen( app.get( "ConfigService" ).appPort );

}

bootstrap();
