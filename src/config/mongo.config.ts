import { Injectable } from "@nestjs/common";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";
import { ConfigService } from "./config.service";


@Injectable()
export class MongoConfig implements MongooseOptionsFactory {

	constructor( private config: ConfigService ) {}

	public createMongooseOptions(): MongooseModuleOptions {

		return {
			uri: this.config.nodeEnv === "test" ? this.config.mongoTestingUri : this.config.mongoUri,
			retryAttempts: 3,
			retryDelay: 15,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		};
	}

}
