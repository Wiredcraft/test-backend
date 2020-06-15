import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Request } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../model/user';
import 'dotenv/config';
import getLogger from '../util/logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export default (pass: passport.PassportStatic): void => {
  /**
   * Jwt strategy
   * verify user identity after login
   */
  pass.use(
    new JwtStrategy(
      {
        jwtFromRequest: (req: Request): string => req.cookies.jwt,
        secretOrKey: process.env.SECRET
      },
      (jwtPayload, done): void => {
        logger.info('jwt auth begin');
        if (Date.now() > jwtPayload.expires) {
          return done('jwt expired');
        }
        return done(null, jwtPayload);
      }
    )
  );

  /**
   * Local strategy
   * classic username password auth
   */
  pass.use(
    new LocalStrategy(
      async (username, password, done): Promise<void> => {
        try {
          const user = await User.findOne({ username });
          const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);

          if (passwordsMatch) {
            return done(null, user);
          }
          return done('Incorrect Username or Password');
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
