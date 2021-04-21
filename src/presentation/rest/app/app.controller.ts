import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  get() {
    return `Welcome, please check out the API documentation at <a href="/api"/>/api</a>`;
  }
}
