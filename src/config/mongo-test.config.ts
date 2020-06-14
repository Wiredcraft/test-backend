import { MongooseModule } from "@nestjs/mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongod = new MongoMemoryServer();

export default ( customOptions: any = {} ) => MongooseModule.forRootAsync( {
	useFactory: async () => {
		const uri = await mongod.getUri();

		return {
			uri,
			retryAttempts: 3,
			retryDelay: 15,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			...customOptions
		};
	}
} );

export const closeMongoConnection = async () => {
	if ( mongod ) await mongod.stop();
};
