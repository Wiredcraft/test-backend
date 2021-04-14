import { JWTService } from './jwt-service';
import { UserProfile } from '@loopback/security';


 
export interface Tokens {
    accessToken: string,
    refreshToken: string,
    expiresIn: number
  }
  

export async function createTokens(userP: UserProfile): Promise<Tokens> {


    // Add error checking and logs
    // Add redis 

    // generate fresh token
    const accessToken =  await JWTService.prototype.generateToken(userP)
    const refreshToken = await JWTService.prototype.generateRefreshToken(userP)
    // check errors here

    const Tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: Number(process.env.JWT_EXPIRE)
    } 
    return Tokens
  }


//   const tv = TokenKv.prototype
//       tv.token = token
      
//       await this.tokenKv.set(userDetails.id.toString(), tv)

//       await this.tokenKv.expire(userDetails.id.toString(), Number(process.env.JWT_EXPIRE))