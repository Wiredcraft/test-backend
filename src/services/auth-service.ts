import { repository } from '@loopback/repository';
import { JWTService } from './jwt-service';
import { securityId, UserProfile } from '@loopback/security';
import { TokenService } from '@loopback/authentication';
import { TokenServiceBindings } from '@loopback/authentication-jwt';
import { inject } from '@loopback/core';
import winston from 'winston';
import { LogConfig } from '../config/logConfig';
import { HttpErrors } from '@loopback/rest';
import { TokenKvRepository } from '../repositories';
import { TokenKv } from '../models';



export interface Tokens {
  accessToken: string,
  refreshToken: string,
  expiresIn: number
}

export class AuthService {
  constructor(
    @repository(TokenKvRepository)
    public redisRepo: TokenKvRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    public logger = winston.loggers.get(LogConfig.logName),
  ) { }

  /**
   * Takes a users and returns access and refresh tokens. 
   * It also saves tokens into redis with ttl of 2 hours
   * @param userP User Profile
   * @returns 
   */
  async createTokens(userP: UserProfile): Promise<Tokens> {
    let accToken = '';
    let refToken = '';

    const userId = String(userP[securityId])

    try {
      accToken = await this.jwtService.generateToken(userP)
      refToken = await JWTService.prototype.generateRefreshToken(userP)


      // Save tokens in redis
      if (accToken && refToken) {
        const userTokens = TokenKv.prototype
        userTokens.accessToken = accToken
        userTokens.refreshToken = refToken
        const tExist = await this.checkTokenExistence(userId)
        if (tExist) { await this.redisRepo.delete(userId) }
        await this.redisRepo.set(userId, userTokens)
        await this.redisRepo.expire(userId, Number(process.env.JWT_EXPIRE))
      }
    } catch (error) {
      this.logger.error('jwt-service-generate: ', error);
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }

    const Tokens = {
      accessToken: accToken,
      refreshToken: refToken,
      expiresIn: Number(process.env.JWT_EXPIRE)
    }
    return Tokens
  }

  async checkTokenExistence(userId: string): Promise<boolean> {
    const token = await this.redisRepo.get(userId);
    if (token) {
      return true
    }
    return false
  }



/**
 * 
 * @param token a refreshed token
 * @returns A new set of tokens.
 */
  async refreshToken(token: string): Promise<Tokens> {
    if(!token){
      this.logger.error('auth-service-refresh: token is missing');
      throw new HttpErrors.BadRequest('Error refreshing token');
  }
    try {
      const user = await JWTService.prototype.verifyRefreshToken(token)
      if (!user) {
        this.logger.error('auth-service-refresh: Failed to verify token');
        throw new HttpErrors.Unauthorized('Error refreshing token');
      }
      const tokens = await this.createTokens(user)
      return tokens
    } catch (error) {
      this.logger.error('auth-service-refresh: ', error);
      throw new HttpErrors.Unauthorized(`Error refreshing tokens : ${error}`);
    }
  }

/**
 * 
 * @param token an access_token
 * @returns a string 
 */
  async logout(token: string): Promise<String> {
    if(!token){
        this.logger.error('auth-service-logout: token is missing');
        throw new HttpErrors.BadRequest('Error logging out');
    }
    try {
      const user = await this.jwtService.verifyToken(token)
      if (!user) {
        this.logger.error('auth-service-logout: Failed to verify token');
        throw new HttpErrors.BadRequest('Error logging out');
      }
      await this.redisRepo.delete(String(user[securityId]))

      return 'Successfully logged user out'
    } catch (error) {
      this.logger.error('auth-service-logout: ', error);
      throw new HttpErrors.Unauthorized(`Error logging out : ${error}`);
    }
  }
}
