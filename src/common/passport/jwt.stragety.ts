import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../../user/user.service';

export interface JWTPayload {
    uid: string;
    password: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'test-backend',
        });
    }

    async validate(payload: JWTPayload) {
        const user = await this.userService.findById(payload.uid);
        if (!user) {
            throw new UnauthorizedException();
        }

        if (user.password !== payload.password) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
