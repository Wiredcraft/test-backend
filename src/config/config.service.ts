import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as Joi from "@hapi/joi";


export type EnvConfig = Record<string, string>;


@Injectable()
export class ConfigService {
	private readonly envConfig: EnvConfig;

	constructor( filePath: string ) {
		const config = dotenv.parse( fs.readFileSync( filePath ) );
		this.envConfig = this.validate( config );
	}

	private validate( config: EnvConfig ) {

		// Describes Configuration Schema
		const envVarsSchema: Joi.ObjectSchema = Joi.object( {
			APP_NAME: Joi.string().default( "Wiredcraft Test API" ),
			NODE_ENV: Joi.string().valid( "test", "development", "staging", "production" ).default( "development" ),
			APP_PORT: Joi.number(),
			MONGO_URI: Joi.string().uri().required(),
			MONGO_TESTING_URI: Joi.string().uri().required(),
			JWT_KEY: Joi.string().required()
		} );

		const { error, value: validatedEnvConfig } = envVarsSchema.validate( config );
		if ( error ) {
			throw new Error( `Config Validation Error: ${ error.message }` );
		}
		return validatedEnvConfig;
	}

	public get appName(): string {
		return this.envConfig.APP_NAME;
	}

	public get nodeEnv(): string {
		return process.env.NODE_ENV || this.envConfig.NODE_ENV;
	}

	public get appPort(): number {
		return Number( this.envConfig.APP_PORT );
	}

	public get mongoUri(): string {
		return this.envConfig.MONGO_URI;
	}

	public get mongoTestingUri(): string {
		return this.envConfig.MONGO_TESTING_URI;
	}

	public get jwtKey(): string {
		return this.envConfig.JWT_KEY;
	}

}
