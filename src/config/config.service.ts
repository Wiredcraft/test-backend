import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as Joi from "@hapi/joi";


export type EnvConfig = Record<string, string>;


@Injectable()
export class ConfigService {
	private readonly envConfig: EnvConfig;

	constructor ( filePath: string ) {
		const config = dotenv.parse( fs.readFileSync( filePath ) );
		this.envConfig = this.validate( config );
	}

	private validate ( config: EnvConfig ) {

		// Describes Configuration Schema
		const envVarsSchema: Joi.ObjectSchema = Joi.object( {
			APP_NAME: Joi.string().default( "Wiredcraft Test API" ),
			NODE_ENV: Joi.string().valid( "testing", "development", "staging", "production" ).default( "development" ),
			APP_PORT: Joi.number().default( 3333 )
		} );

		const { error, value: validatedEnvConfig } = envVarsSchema.validate( config );
		if ( error ) {
			throw new Error( `Config Validation Error: ${ error.message }` );
		}
		return validatedEnvConfig;
	}

	public get appName (): string {
		return this.envConfig.APP_NAME;
	}

	public get nodeEnv (): string {
		return this.envConfig.NODE_ENV;
	}

	public get appPort (): number {
		return Number( this.envConfig.APP_PORT );
	}

}
