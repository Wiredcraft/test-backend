import { Controller, Get } from "@nestjs/common";


@Controller()
export class AppController {

	@Get( "/healthcheck" )
	getHello(): boolean {
		return true;
	}
}
