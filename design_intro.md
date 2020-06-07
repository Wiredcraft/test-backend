# How it's designed

## Tech stack

- Nodejs and Koa2
- MongoDB and Mongoose

## Features

- User api

  `listUsers`/`createUser`/`getUserById`/`updateUser`/`deleteUser`

  \* An `admin` user will be saved in the database with a defualt password.

- Friendship api

  `createFriendship`/`deleteFriendship`/`listFollowersById`/`listFollowingsById`

  A friendship is a one-way relationship from one `follower` to one `following`.

- Authentication api

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

## Api design

The API structure was edited and saved in file: [./openapi.yml](./openapi.yml).

You can use Swagger Editor([http://editor.swagger.io/](http://editor.swagger.io/)) to preview it.

\* `list` api can use `offset`, `limit`, `sort`, `filter` to make a request with filter.

![swagger.png](https://i.loli.net/2020/06/07/E3khLdoDCmlyfVP.png)

## Model design

- UserModel
- PasswordModel
- SessionModel
- FriendshipModel
