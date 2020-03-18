import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingKey} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {jwtTokenExpiresIn, jwtTokenSecret} from './config';
import {MyAuthenticationSequence} from './sequence';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from './services';
import {JWTService} from './services/jwt-service';
import {BcryptHasher} from './services/password-service';
import {MyUserService} from './services/user-service';
import {SECURITY_SCHEMA_SPEC} from './specs/security-spec';
import {JWTAuthenticationStrategy} from './strategies/jwt-strategy';

export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package');
const pkg: PackageInfo = require('../package.json');

export class HelloWiredcraftApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.api({
      openapi: '3.0.0',
      info: {title: pkg.name, version: pkg.version},
      paths: {},
      components: {securitySchemes: SECURITY_SCHEMA_SPEC},
      servers: [{url: '/'}],
    });

    // Set up the custom sequence
    // this.sequence(MySequence);
    this.sequence(MyAuthenticationSequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Stepup Bindings
    this.setupBindings();

    // Bind authentication component related elements
    this.component(AuthenticationComponent);

    // Register JWT Authentication
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

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

  setupBindings(): void {
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(jwtTokenSecret!);
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(jwtTokenExpiresIn!);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);

    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
  }
}
