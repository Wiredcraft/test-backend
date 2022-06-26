# Backend Developer (Node.js) test

## TODO list

- [x] API for user CRUD
  - Implements by
    - POST    /account/signin
    - GET     /user/
    - GET     /user/:id
    - PATCH   /user/:id
    - DELETE  /user/:id	Doc
- [x] Logging strategy
  - Implements by
    - POST    /account/signin
    - POST    /account/signup
    - Guard middleware
- [x] User auth
  - Implements by
    - GET	/auth/authorizate	Doc
    - POST	/auth/authorizate	Doc
    - POST	/auth/token	Doc
    - PATCH	/auth/token	Doc
- [x] to link to each other
  - Implements by
    - POST     /user/relation/follow
    - DELETE   /user/relation/follow
- [X] check nearby friends
  - Implements by
    - GET     /user/nearby

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

100% test coverage with e2e test (for auth testing);

## Extensiblity

For good extensiblity, we implements a simple dependency inject.

For example, if we get a Auth Controller, it will build instance tree liek:

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

If the MongoDB is good, we should create geographic index

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
