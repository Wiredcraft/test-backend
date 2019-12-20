import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserModule} from "../user/user.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import { jwtcfg } from "./constants";

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({secret: jwtcfg.secret})],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
