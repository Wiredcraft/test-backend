import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class AuthSerializer extends PassportSerializer {

    constructor() {
        super();
    }

    serializeUser(user: any, done: (error: null, user: any) => any) {
        done(null, user);
    }

    async deserializeUser(payload: any, done: (error: null, payload: any) => any) {
        done(null, payload);
    }
}
