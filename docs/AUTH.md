<h1 align="center">Wiredcraft Backend Test Document</h1>
<div align="center">
  <strong>Backend Development Evaluation Test</strong>
</div>
<br />

## Table of Content
* [Strategy](#strategy)


## Strategy
Passport is used for authentication. Passport is extensible by default and I use its local (username & password) and jwt strategies in this project.

### Authentication Flow
1. Unauthenticated requests are made to either `/auth/login`
2. The request is intercepted by the `LocalAuthGuard` which extends `AuthGuard` provided by NestJS passport module. This module is a wrapper for passports middleware and it takes in one parameter, the type.
3. The interceptor checks for the type of strategy and calls the related `validate` method.
4. The request is validated as defined in `src/modules/auth/strategies/local.strategy.ts`
5. In here, I authorize the request with records in the database
6. The password is validated using argon2 hashing mechanism.
7. If validated, a jwt token is signed and issued to the user.


### Authorization Flow
1. The base API is protected with the `JWTAuthGuard`
2. Once a token is issued, you may attach it to subsequent requests as a Bearer token.
3. In the controller, the guard is applied on the entire controller to protect all methods
