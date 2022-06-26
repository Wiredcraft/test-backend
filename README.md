# Backend Developer (Node.js) test

## TODO list

- [x] API for user CRUD
  - Implements by
    - Auth
    - User
- [x] Complete user auth
  - Implements by
    - Auth
    - User
- [x] to link to each other
- [ ] check nearby friends

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
