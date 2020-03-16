import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {TokenServiceBindings} from './bindings';

const jwt = require('jsonwebtoken');
const _signAsync = promisify(jwt.sign);
const _verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET) private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN) private jwtExpiresIn: string,
  ) {}

  async verifyToken(
    token: string,
    verifyAsync: Function = _verifyAsync,
  ): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token: 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      const decryptedToken = await verifyAsync(token, this.jwtSecret);
      userProfile = Object.assign(
        {[securityId]: '', name: ''},
        {
          [securityId]: decryptedToken.id,
          id: decryptedToken.id,
          name: decryptedToken.name,
        },
      );
      return userProfile;
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token: ${error.message}`,
      );
    }
  }

  async generateToken(
    userProfile: UserProfile,
    signAsync: Function = _signAsync,
  ): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token: userProfile is null',
      );
    }

    let token: string;
    try {
      token = await signAsync(userProfile, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn),
      });
      return token;
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token: ${error}`);
    }
  }
}
