import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";


@Controller( "/healthcheck" )
@ApiTags( "Healthcheck" )
export class HealthcheckController {

	@Get()
	getHealth(): boolean {
		return true;
	}
}
