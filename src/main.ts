import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
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
	} ) ); // Allows for Class-Validator to mutate request objects

	app.use( helmet() ); // Setups up common http security measures
	app.use( RateLimitConfig() ); // Sets rate limiter from defined configuration

	// Setup Swagger documentation and bind to /api/docs
	const options = new DocumentBuilder()
		.setTitle( app.get( "ConfigService" ).appName )
		.setDescription( "API Documentation" )
		.setVersion( "1.0" )
		.build();
	const document = SwaggerModule.createDocument( app, options );
	SwaggerModule.setup( "api/docs", app, document );

	await app.listen( app.get( "ConfigService" ).appPort );

}

bootstrap();
