import { Strategy } from 'passport-local';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  
} from '@nestjs/common';
import { UserService } from './user.service';
import { useLogger } from '../util/logger';
import { runWithDeps } from '../util/deps';
import { Observable, lastValueFrom } from 'rxjs';
import { isBoolean } from 'class-validator';
import { isPromise } from 'util/types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private service: UserService) {
    super();
  }

  async validate(userName: string, password: string): Promise<any> {
    try {
      const user = await this.service.validateUser({ userName, password });
      return user;
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
}

/**
 * @description 验证用户是否登录
 */
@Injectable()
export class LocalGuard extends AuthGuard('local') {
  protected readonly logger = useLogger(this);
  
  async canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: unknown }>();
    if (request.method.toUpperCase() === 'GET') return true;

    if (request.url.includes('login') || request.url.includes('register')) {
      const flag = await super.canActivate(context);
      if (isBoolean(flag)) return flag as boolean
      return lastValueFrom((flag as Observable<boolean>));
    }
    const token = request.headers['authorization'];
    if (!token) {
      return false;
    }
    const granted = await runWithDeps([UserService], async (service: UserService) => {
      const user = service.validateUserByToken(token);
      request.user = user;
      return !!user;
    })
    return granted;
  }
  
}
