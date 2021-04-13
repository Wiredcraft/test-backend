import { TokenKvRepository } from './../repositories/token-kv.repository';
import {TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import * as winston from 'winston';
import {LogConfig} from '../config/logConfig';
import { repository } from '@loopback/repository';
import { TokenKv } from '../models';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export interface Tokens {
  accessToken: string,
  refreshToken: string,
  expiresIn: number
}

export class JWTService implements TokenService {
  constructor(
    @repository(TokenKvRepository) public tokenKv: TokenKvRepository,
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpires: string,
    public logger = winston.loggers.get(LogConfig.logName),
  ) {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      this.logger.error('jwt-service-verify: Login token not available');
      throw new HttpErrors.Unauthorized(`Error occurred while verifying token: 'token' is null`);
    }

    let userProfile: UserProfile;
    try {
      const decodedToken = await verifyAsync(token, this.jwtSecret);
      userProfile = Object.assign(
        {[securityId]: '', name: ''},
        {
          [securityId]: decodedToken.id,
          name: decodedToken.name,
          id: decodedToken.id,
        },
      );
    } catch (error) {
      this.logger.error('jwt-service-verify: ', error);
      throw new HttpErrors.Unauthorized(`Error occurred while verifying token : ${error.message}`);
    }
    return userProfile;
  }


  // async revokeToken(token: string): Promise<boolean> {
  //   if (!token) {
  //     this.logger.error('jwt-service-logout: Logout token not available');
  //     throw new HttpErrors.Unauthorized(`Error occurred during logout: Must be a wrong token `);
  //   }

  //   let revoke: boolean;
  //   try {
  //     revoke = await revokeToken(token)
  //   } catch (error) {
  //     this.logger.error('jwt-service-logout: Error occurred during logout!');
  //   }
  //   return revoke;
  // }


  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      this.logger.error('jwt-service-generate: No user profile');
      throw new HttpErrors.Unauthorized(`Error when generating token : userProfile is null`);
    }
    const userDetails = {
      id: userProfile[securityId],
      name: userProfile.name, 
    };
    // Generate the JSON Web Token
    let token: string;
    try {
      token = await signAsync(userDetails, this.jwtSecret, {expiresIn: Number(this.jwtExpires)});
     
      const tv = TokenKv.prototype
      tv.token = token
      
      await this.tokenKv.set(userDetails.id.toString(), tv)
      await this.tokenKv.expire(userDetails.id.toString(), Number(this.jwtExpires))
    } catch (error) {
      this.logger.error('jwt-service-generate: ', error);
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }

    // const Tokens = {
    //   accessToken: token,
    //   refreshToken: token,
    //   expiresIn: this.jwtExpires
    // }

    return token;
  }


  

  // async generateRefreshToken(refreshToken: string): Promise<
}
