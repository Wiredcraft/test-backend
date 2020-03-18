import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule } from '../config/config.module';
import { AuthController } from './auth.controller';
import { HmacStrategy } from './hmac.strategy';

@Module({
  imports: [ConfigModule],
  providers: [AuthService, HmacStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
