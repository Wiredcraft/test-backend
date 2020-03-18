import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  Dependencies,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
@Dependencies(AuthService)
export class HmacStrategy extends PassportStrategy(Strategy, 'HMAC') {
  constructor(authService) {
    super();
    this.authService = authService;
  }

  async validate(req) {
    const appId = req.headers['x-application-id'];
    const timestamp = req.headers['x-timestamp'];
    const signature = req.headers['x-signature'];
    const user = await this.authService.authIdentity(
      appId,
      timestamp,
      signature,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
