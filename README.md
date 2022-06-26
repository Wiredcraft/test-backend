# Backend Developer (Node.js) test

## TODO list

- [x] API for user CRUD
  - Implements by
    - POST    /account/signin [Doc](https://lellansin.github.io/test-backend/classes/controller_account.AccountController.html#signInPage)
    - GET     /user/ [Doc](https://lellansin.github.io/test-backend/classes/controller_user.UserController.html#getList)
    - GET     /user/:id [Doc](https://lellansin.github.io/test-backend/classes/controller_user.UserController.html#getById)
    - PATCH   /user/:id [Doc](https://lellansin.github.io/test-backend/classes/controller_user.UserController.html#update)
    - DELETE  /user/:id	Doc [Doc](https://lellansin.github.io/test-backend/classes/controller_user.UserController.html#delete)
- [x] Logging strategy
  - Implements by
    - POST    /account/signin [Doc](https://lellansin.github.io/test-backend/classes/controller_account.AccountController.html#signIn)
    - POST    /account/signup [Doc](https://lellansin.github.io/test-backend/classes/controller_account.AccountController.html#signUp)
    - Guard middleware [Doc](https://lellansin.github.io/test-backend/modules/middleware_loginRedirect.html)
- [x] User auth
  - Implements by
    - GET    /auth/authorizate [Doc](https://lellansin.github.io/test-backend/classes/controller_auth.AuthController.html#renderPage)
    - POST   /auth/authorizate [Doc](https://lellansin.github.io/test-backend/classes/controller_auth.AuthController.html#authorizate)
    - POST   /auth/token       [Doc](https://lellansin.github.io/test-backend/classes/controller_auth.AuthController.html#accessToken)
    - PATCH  /auth/token       [Doc](https://lellansin.github.io/test-backend/classes/controller_auth.AuthController.html#refreshToken)
    - POST   /auth/client      [Doc](https://lellansin.github.io/test-backend/classes/controller_auth.AuthController.html#createClient)
  - Check [AuthFlow](https://lellansin.github.io/test-backend/modules/controller_auth.html#simple-authflow) doc for summary.
- [x] to link to each other
  - Implements by
    - POST   /user/relation/follow [Doc](https://lellansin.github.io/test-backend/classes/controller_user.UserController.html#follow)
    - DELETE /user/relation/follow [Doc](https://lellansin.github.io/test-backend/classes/controller_user.UserController.html#unfollow)
- [X] check nearby friends
  - Implements by
    - GET /user/nearby [Doc](https://lellansin.github.io/test-backend/classes/controller_user.UserController.html#getNearbyList)

## Project Structure

Request flow looks like:

```
Request
  --->
    Controllers
      --->
        Services (if need)
          --->
            Models (if need)
          <---
      <---
  <---
Response
```

The main roles are Controller, Service, Model.

Corresponding to MVC design pattern, we can see:

- (C) Input logic: handling with Controllers
- (M) Business Logic: handling with Service (with Model if need)
- (V) UI Logic: handling with ViewService (it host the templates at `src/view`)

## Testing approach

100% test coverage with e2e test (for auth testing):

![unittest.gif](https://github.com/Lellansin/test-backend/raw/master/asserts/unittest.gif)

## Extensiblity

For good extensiblity, implement a simple dependency inject.

For example, if we get a Auth Controller, it will build instance tree like:

```
- AuthController
  - AuthService
    - UserModel
      - MongoDB (Singleton)
    - TokenModel
      - MongoDB (Singleton)
    - CacheService
      - Redis (Singleton)
  - ViewService
```

## How to run

### Before start

This project requires `mongodb` and `redis`. We should config them first, and the
config file located `src/config/config.default`:

```typescript
// src/config/config.default.ts

export const mongo: DataSourceOptions = {
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  username: 'root',
  password: '',
  database: 'test-backend'
};

export const redis: RedisOptions = {
  port: 6379
};

// ...
```

We can config the options above to connect to exist DB, or using docker:

```
docker run -p 27017:27017 -it mongo
docker run -it -p 6379:6379 redis
```

If the MongoDB is good, we should create geographic index first:

```shell
$ mongo
> use test-backend # database name configured in src/config/config.default
> db.user.createIndex({ location: "2d" } )
```

### Run test-backend

```shell
# install dependencies
npm install

# run app
npm run dev
```

### Run test with coverage

```shell
npm run cov
```

### Run thrid party app (for auth test)

```shell
npm run test-thrid-party-app
```

## Reading Guide

For document reading, recommend order:

- [Application Entry](https://lellansin.github.io/test-backend/modules/Application.html)
- [Middlewares](https://lellansin.github.io/test-backend/modules/middleware.html)
- [Controllers](https://lellansin.github.io/test-backend/modules/controller.html)

For code reading, recommend order:

- [@Provide](https://github.com/Lellansin/test-backend/blob/master/src/util/container.ts#L199) register class, and [getInstanceByClass](https://github.com/Lellansin/test-backend/blob/master/src/util/container.ts#L199) new class.
- [@Middleware]() register middlewares, and [loadMiddlewares](https://github.com/Lellansin/test-backend/blob/master/src/util/web.ts#L62).
- [@Get](https://github.com/Lellansin/test-backend/blob/master/src/util/web.ts#L176) register router, and [loadControllers](https://github.com/Lellansin/test-backend/blob/master/src/util/web.ts#L79).
- [service.test.ts](https://github.com/Lellansin/test-backend/blob/master/test/service.test.ts) for business logic .

For auth implement, recomend reading: 

- Document: [AuthFlow](https://lellansin.github.io/test-backend/modules/controller_auth.html#simple-authflow)
- Code: [Auth APIs](https://github.com/Lellansin/test-backend/blob/master/src/controller/auth.ts), [3rd-party Test App](https://github.com/Lellansin/test-backend/blob/master/test/thridPartyApp.ts) and [e2e test](https://github.com/Lellansin/test-backend/blob/master/test/api.test.ts#L345)

For nearby following implement, recomend reading:

- [Relation Entity](https://github.com/Lellansin/test-backend/blob/master/src/entity/relation.ts)
- [UserSerivce#getNearbyList](https://github.com/Lellansin/test-backend/blob/master/src/service/user.ts#L113)

## Last

Thanks for reading, I'm looking forward to our collaboration.
