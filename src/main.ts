import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as helmet from "helmet";
import { WinstonModule } from "nest-winston";
import { AppModule } from "./app.module";
import LogConfig from "./config/log.config";
import RateLimitConfig from "./config/rate-limit.config";

async function bootstrap() {
	const app = await NestFactory.create( AppModule, {
		logger: WinstonModule.createLogger( LogConfig() )
	} );

	// Add Middleware
	app.useGlobalPipes( new ValidationPipe( {
		whitelist: true,
		transform: true
	} ) );
	app.use( helmet() );
	app.use( RateLimitConfig() );

	await app.listen( app.get( "ConfigService" ).appPort );

}

bootstrap();
