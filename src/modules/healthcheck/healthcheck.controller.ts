import { Controller, Get } from "@nestjs/common";


@Controller("/healthcheck")
export class HealthcheckController {

	@Get()
	getHealth(): boolean {
		return true;
	}
}
