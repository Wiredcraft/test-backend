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
