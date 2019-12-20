import { Module } from '@nestjs/common';
import { UserModule } from '../../user/user.module';
import { AuthSerializer } from './auth.serializer';
import { JwtStrategy } from './jwt.stragety';

@Module({
    imports: [UserModule],
    providers: [
        AuthSerializer,
        JwtStrategy,
    ],
})
export class PassportModule { }
