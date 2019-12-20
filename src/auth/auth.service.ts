import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import { compareSync } from 'bcrypt';
import {User} from "../user/models/user.m";
import {UserService} from "../user/user.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findByUsername(username);
        if (user && compareSync(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User) {
        const payload = {username: user.name, id: user._id};
        return {access_token: this.jwtService.sign(payload)};
    }
}
