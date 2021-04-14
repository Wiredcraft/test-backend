import { TokenKvRepository } from './../repositories/token-kv.repository';
import {TokenService} from '@loopback/authentication';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import * as winston from 'winston';
import {LogConfig} from '../config/logConfig';
import { repository } from '@loopback/repository';


const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
  constructor(
    @repository(TokenKvRepository) public tokenKv: TokenKvRepository,
    public logger = winston.loggers.get(LogConfig.logName),
  ) {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      this.logger.error('jwt-service-verify: Login token not available');
      throw new HttpErrors.Unauthorized(`Error occurred while verifying token: 'token' is null`);
    }

    let userProfile: UserProfile;
    try {
      const decodedToken = await verifyAsync(token, process.env.JWT_SECRET);
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

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      this.logger.error('jwt-service-generate: No user profile');
      throw new Error(`Error when generating token : userProfile is null`);
    }
    const userDetails = {
      id: userProfile[securityId],
      name: userProfile.name, 
    };
    // Generate the JSON Web Token
    let token: string;
    try {
      token = await signAsync(userDetails, process.env.JWT_SECRET, {expiresIn: Number(process.env.JWT_EXPIRE)});
     
    } catch (error) {
      this.logger.error('jwt-service-generate: ', error);
      throw new Error(`Error encoding token : ${error}`);
    }
    return token;
  }


/**
 * Takes a user's profile and generates a refresh Token
 * @param userProfile 
 * @returns a refresh token
 */
  async generateRefreshToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      this.logger.error('jwt-service-refresh: No user profile');
      throw new HttpErrors.Unauthorized(`Error when refreshing token : userProfile is null`);
    }
    const userDetails = {
      id: userProfile[securityId],
      name: userProfile.name, 
    };
    let token: string;
    try {
      token = await signAsync(userDetails, process.env.JWT_REFRESH_SECRET, {expiresIn: Number(process.env.JWT_EXPIRE)});
    } catch (error) {
      this.logger.error('jwt-service-refresh:: ', error);
      throw new Error(`Error encoding refresh token : ${error}`);
    }
    return token;
  }


  async verifyRefreshToken(token: string): Promise<UserProfile> {
    if (!token) {
      this.logger.error('jwt-service-verify: Login token not available');
      throw new HttpErrors.Unauthorized(`Error occurred while verifying token: 'token' is null`);
    }

    let userProfile: UserProfile;
    try {
      const decodedToken = await verifyAsync(token, process.env.JWT_REFRESH_SECRET);
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
}

