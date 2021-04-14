import { AuthService } from './services/auth-service';
import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent, SecuritySpecEnhancer, TokenServiceBindings} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {HealthBindings, HealthComponent} from '@loopback/extension-health';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import moment from 'moment';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import {LogConfig} from './config/logConfig';
import { PasswordHasherBindings, UserServiceBindings, AuthServiceBindings } from './keys';
import {MySequence} from './sequence';
import {BcryptHasher} from './services/hash.password.bcrypt';
import {JWTService} from './services/jwt-service';
import {CustomUserService} from './services/user-service';

export {ApplicationConfig};

export class TestBackendApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Bind authentication components
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);

    // Bind health Check Component
    this.component(HealthComponent);
    this.configure(HealthBindings.COMPONENT).to({
      healthPath: '/health',
    });

    // Load environment variables
    dotenv.config();
    dotenvExt.load({
      schema: '.env',
      errorOnMissing: true,
    });

    // FIXME: Extract to separate log config file.
    const customFormat = winston.format.combine(
      winston.format.splat(),
      winston.format.simple(),
      winston.format.json(),
      winston.format.align(),
      winston.format.printf(info => `${moment().format('YYYY-MM-DD HH:mm:ss:SS')} - ${info.level}: ${info.message}`),
    );

    winston.loggers.add(LogConfig.logName, {
      exitOnError: false,
      format: winston.format.combine(customFormat),
      
      transports: [
        new DailyRotateFile({
          filename: LogConfig.logDirectory + LogConfig.logFileError,
          datePattern: LogConfig.logDatePattern,
          zippedArchive: true,
          handleExceptions: true,
          level: 'error',
        }),
        new DailyRotateFile({
          filename: LogConfig.logDirectory + LogConfig.logFileDebug,
          datePattern: LogConfig.logDatePattern,
          zippedArchive: true,
          level: 'debug',
        }),
        new DailyRotateFile({
          filename: LogConfig.logDirectory + LogConfig.logFileInfo,
          datePattern: LogConfig.logDatePattern,
          zippedArchive: true,
          level: 'info',
        }),
        new winston.transports.Console({
          handleExceptions: true,
        }),
      ],
    });

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    this.setUpBindings();

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/swagger',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  // Add Bindings
  setUpBindings(): void {
    // Bind encryption serivces
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(CustomUserService);
    this.bind(AuthServiceBindings.AUTH_SERVICE).toClass(AuthService)
    this.add(createBindingFromClass(SecuritySpecEnhancer));
  }
}
