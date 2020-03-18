import { Controller, UseGuards, Bind, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('HMAC'))
  @Get('identity')
  @Bind(Req())
  async getIdentity(req) {
    return req.user;
  }
}
