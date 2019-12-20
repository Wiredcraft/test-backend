import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { BaseService } from '../common/base.service';
import { JWTPayload } from '../common/passport/jwt.stragety';
import { User } from '../schema/user/user.interface';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {
        super(userModel);
    }

    async login(name: string, password: string) {
        name = name.trim();
        const user = await this.findOne({ name });
        if (!user) {
            throw new UnauthorizedException(`User ${name} does not exist`);
        }
        const match = user.authenticateUser(password);
        if (!match) {
            throw new UnauthorizedException('Password incorrect');
        }
        return this.userToken(user);
    }

    private userToken(user: User): string {
        const payload: JWTPayload = {
            uid: user.id,
            password: user.password,
        };

        const token = jwt.sign(payload, 'test-backend', {
            expiresIn: 60 * 60 * 24 * 3,
        });
        return `Bearer ${token}`;
    }
}
