import {Body, Controller, Get, Post, Request, UnauthorizedException} from '@nestjs/common';
import { AppService } from './app.service';
import {AuthService} from "./auth/auth.service";
import {ApiOkResponse, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {AuthCredentialDto} from "./auth/dto/auth-credential.dto";

@ApiTags('Global')
@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly authService: AuthService
  ) {}

  @Post('auth/login')
  @ApiUnauthorizedResponse({description: 'user/password failed'})
  @ApiOkResponse({description: 'object contains access_token'})
  async login(@Body() authCredentialDto: AuthCredentialDto) {
      let user = await this.authService.validateUser(authCredentialDto.username, authCredentialDto.password);
      if (user) {
          return await this.authService.login(user);
      }
      throw new UnauthorizedException();
  }
}
