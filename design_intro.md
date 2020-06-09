# How it's designed

## Tech stack

- Nodejs and Koa2
- MongoDB and Mongoose
- RESTful API design
- Jest and supertest

## Features

- User api

  `listUsers`/`createUser`/`getUserById`/`updateUser`/`deleteUser`

  \* An `admin` user will be saved in the database with a defualt password.

- Friendship api

  `createFriendship`/`deleteFriendship`/`listFollowersById`/`listFollowingsById`

  A friendship is a one-way relationship from one `follower` to one `following`.

- Authentication api (password login/Github OAuth login, logout)

  `login`/`logout`/`reqGithub`/`reqGithubCallback`

  User can login by user and password or `Github Oauth`. After login user can get a JWT token for further api authorization.

- JWT authentication and session state

  We use JWT tokens to decide whether a request is valid. When a user login, he/she will get a JWT token to use for further api requests, and the service will save a login session state in the database. After logout, the token will be invalid and the session state will be deleted.

## Folder structures

```sh
./src
├── api
├── config
├── lib
├── middlewares
├── models
├── services
├── app.js
├── index.js
├── server.js
./test
```

Service running code in the `./src` folder.

- `api`: api routes

- `config`: environment settings

- `lib`: some useful library and functions

- `middleware`: koa middlewares

- `models`: mongoose models

- `services`: api services

- `app.js`: main program

- `index.js`: reference catalog

- `server.js`: server start up entrance

Service test code in the `./test` folder.

## API design

The RESTful API structure was edited and saved in the openapi file: [./openapi.yml](./openapi.yml).

You can use Swagger Editor([http://editor.swagger.io/](http://editor.swagger.io/)) to preview it.

\* `list` api can use query parameters `offset`, `limit`, `sort`, `filter` to make a request with filter.

![swagger.png](https://i.loli.net/2020/06/07/E3khLdoDCmlyfVP.png)

## Model design

All models are compiled by `Mongoose`. Each model has `id`, `createdAt`, `updatedAt`, `deleted` and `deletedAt` in its schema.

### User model schema

```json
{
  "id": "xxx", // user ID
  "name": "test", // user name (limited to be unique)
  "dob": "1988-08-08", // date of birth
  "address": "", // user address
  "description": "", // user description
  "github": "", // github login name
  "deleted": true, // is user deleted(undefined||true)
  "deletedAt": "2020-06-07 02:04:31.461Z", // deleted date
  "createdAt": "2020-06-07 01:04:31.461Z", // created date
  "updateAt": "2020-06-07 01:04:31.461Z" // update date
}
```

### Password model schema

A Password document will be created while a user is created.

```json
{
  "id": "xxx", // password ID
  "user": "xxx", // user ID
  "password": "xxx", // user password(encrypted)
  "createdAt": "2020-06-07 01:04:31.461Z", // created date
  "updateAt": "2020-06-07 01:04:31.461Z" // update date
}
```

\* We haven't developed a `change password` api yet. Users are using a default password. The default password was set in configuration(`DEFAULT_PWD`).

### Session model schema

A Session document will be created while a successful user login happened. The session will be deleted when this user logout.

```json
{
  "id": "xxx", // session ID
  "user": "xxx", // user ID
  "type": "xxx", // session type(how user logined: "password"||"github")
  "deleted": true, // is session deleted(undefined||true)
  "deletedAt": "2020-06-07 02:04:31.461Z", // deleted date
  "createdAt": "2020-06-07 01:04:31.461Z", // created date
  "updateAt": "2020-06-07 01:04:31.461Z" // update date
}
```

\* For future development, user's geographic, and other client fingerprint information can be saved in the session model.

### Friendship model schema

A friendship is a one-way relationship from one `follower` to one `following`.

```json
{
  "id": "xxx", // friendship ID
  "from": "xxx", // follower user ID
  "to": "xxx", // following user ID
  "deleted": true, // is friendship deleted(undefined||true)
  "deletedAt": "2020-06-07 02:04:31.461Z", // deleted date
  "createdAt": "2020-06-07 01:04:31.461Z", // created date
  "updateAt": "2020-06-07 01:04:31.461Z" // update date
}
```

## Login and Logout

User can use `/auth/login` api to apply password login, or `/auth/github` api to apply Github OAuth login.

After a successful login, user will receive a JWT token and user's information. The service server will save a session document in database to record the session state.

### OAuth

We provide Github Oauth login in the service to exsited users with github information.

The front end client can use the link of api `/auth/github`. This link without any parameters will redirect to a Github Oauth link about a Github account information access. Authorization of this Oauth will automatically redirect to a callback link `/auth/github/callback` with Github access token. The service will request Github account information with this token. If Github return the user's login name which can match some user's github info in our service, we will pass the login with JWT token information. Otherwise we will throw authentication error.

### OAuth service setting

For backend developer, you need to register your service on the [Github Oauth App Setting](https://github.com/settings/developers) page.

![github.png](https://i.loli.net/2020/06/07/Aj4aSyQ69dgGxwk.png)

[./how_to_run.md](./how_to_run.md) have the `OAuth service setting` section to give setting details.

## Authentication

We use JWT tokens to decide whether a request is valid. A token was given by login request.After a logout request, the token will be invalid.

### How to get token

The JWT access token will be given by login or oauth login API request.
For example,

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWVkYzgzMjg4NDZlMmI3NzkyOGE3NDU0IiwidHlwZSI6InBhc3N3b3JkIiwic2Vzc2lvbiI6IjVlZGM4MzgyODQ2ZTJiNzc5MjhhNzQ1NiIsImlhdCI6MTU5MTUwOTg5MCwiZXhwIjoxNTkxNTk2MjkwfQ.Rjh5QOmgVZOv1fND6PbuF2O8iEeME658GpC-9D-SPtU",
  "user": {
    "name": "dfdf",
    "dob": "<string>",
    "address": "<string>",
    "description": "<string>",
    "github": "lalawow",
    "updatedAt": "2020-06-07T06:03:20.289Z",
    "createdAt": "2020-06-07T06:03:20.289Z",
    "id": "5edc8328846e2b77928a7454"
  }
}
```

A JWT token is generated by encryption with a payload, a secret JWT key and an expired date.
The payload is about the session.

```json
{
  "user": "xxx", // user id
  "type": "xxx", // login type: "password"||"github"
  "session": "xxx" //session id
}
```

### Valid request

Except `/auth/login`, `/auth/github`, and `/auth/github/callback`, every api needs a HTTP header(`Authorization`) with a valid bearer token to make a valid request.

```text
Authorization:  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWVkYzgzMjg4NDZlMmI3NzkyOGE3NDU0IiwidHlwZSI6InBhc3N3b3JkIiwic2Vzc2lvbiI6IjVlZGM4MzgyODQ2ZTJiNzc5MjhhNzQ1NiIsImlhdCI6MTU5MTUwOTg5MCwiZXhwIjoxNTkxNTk2MjkwfQ.Rjh5QOmgVZOv1fND6PbuF2O8iEeME658GpC-9D-SPtU
```

### Authentication middlewares

- JWT verification middleware is provided by `koa-jwt`.

```javascript
app.use(
  jwt({ secret: JWT_KEY }).unless({
    path: [/\/auth\/github*/, /\/auth\/login/, /favicon.ico/],
  })
);
```

- We use middlewares `sessionValid` and `authorizationValid` to pick the session and user information from the JWT token in the HTTP header.

`sessionValid` will check whether the login session is alive.

`authorizationValid` will check whether the user get the authorization to request the api.
Now no actual authorization limit is applied yet.

## Test

We use Jest and supertest to run the test.

Run test script will start a full test. It will give a coverage report in the end.

```sh
yarn test
```

### Unit tests for mongoose models

Unit tests for mongoose models are wrote in the `./src/models` with those model files.

Each model has its own test file.

Currently the service didn't use complicated methods of models. So the tests here are very basic.

### Service integrated tests

Service integrated tests are wrote in the `./test`.

Each service has its own test file.

We use `./test/app-manager.js` to run `supertest` to request our API to run the tests.

\* I need more time to figure out Github OAuth's test. It's not there yet.

## To-do list

- Save sessions data in the `Redis` instead of MongoDB, due to `sessionValid` and `authorizationValid` workload

- Test for Github Oauth login

- Adjust API response body structure as

```sh
  {
    success: true,
    code: 200,
    data: {},
    message: "job done."
  }
```

- Use `moment` to format user's dob info

- Convert user's address info into geographic coordinates, and use it search close range friend.

```sh
UserModel.find({"addressGeo": {$near: fromUser.addressGeo}, $maxDistance:0.1})
```
