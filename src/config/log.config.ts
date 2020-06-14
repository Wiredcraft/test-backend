import { join } from "upath";
import { format, transports } from "winston";


export default () => {

	const logDir = join( process.cwd(), "src/storage/logs" );

	const logFilePrefix = "test-backend";

	return {
		transports: [
			new transports.File( {
				dirname: logDir,
				filename: `${ logFilePrefix }-backend-exceptions.log`,
				level: "error",
				handleExceptions: true,
				tailable: true
			} ),
			new transports.File( {
				dirname: logDir,
				filename: `${ logFilePrefix }-backend-debug.log`,
				level: "debug",
				tailable: true
			} ),
			new transports.File( {
				dirname: logDir,
				filename: `${ logFilePrefix }-backend.log`,
				level: "info",
				tailable: true
			} ),
			new transports.Console(
				{
					handleExceptions: true,
					format: format.combine(
						format.timestamp(),
						format.json()
					)
				}
			)
		]
	};

}
