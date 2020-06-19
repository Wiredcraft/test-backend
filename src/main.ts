import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as helmet from "helmet";
import { WinstonModule } from "nest-winston";
import { AppModule } from "./app.module";
import LogConfig from "./config/log.config";
import RateLimitConfig from "./config/rate-limit.config";
import { GlobalErrorFilter } from "./modules/shared/filters/global-error.filter";

async function bootstrap() {
	const app = await NestFactory.create( AppModule, {
		logger: WinstonModule.createLogger( LogConfig() )
	} );

	// Add Middleware
	app.useGlobalPipes( new ValidationPipe( {
		whitelist: true,
		transform: true
	} ) ); // Allows for Class-Validator to mutate request objects

	app.use( helmet() ); // Setups up common http security measures
	app.use( RateLimitConfig() ); // Sets rate limiter from defined configuration

	app.useGlobalFilters( new GlobalErrorFilter() );
	await app.listen( app.get( "ConfigService" ).appPort );

}

bootstrap();
