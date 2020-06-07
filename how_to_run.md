# How To Run the Service

## We need node

Make it sure you have the `node` installed.

```sh
node --version
```

If you got error here, please google how to install `node` for your OS.

## Prepare service with docker

If you don't have a mongoDB server running, you can use `docker-compose` to set it up.

`docker-compose` can provide a needed mongodb server here. Use it from the root directory of this service.

```sh
docker-compose up -d
```

## Install dependencies

```sh
yarn
```

## Configuration

Default configurations are provided in file [./src/config/index.js](./src/config/index.js).

You can change any configuration value in file ./.env .

For example

```text
DEFAULT_PWD = test-backend
GITHUB_CLIENT_ID = eff6cf75bc7f66512f04
GITHUB_CLIENT_SECRET = a58b56389ca91509bcc2a386ee52bde34d66540d
```

## Github OAuth Setting

To use the Github OAuth login, you need to register your service on the [Github Oauth App Setting](https://github.com/settings/developers) page.

![github.png](https://i.loli.net/2020/06/07/Aj4aSyQ69dgGxwk.png)

You need to set the correct `Homepage URL` and `Authorization callback URL`(`/auth/github/callback` api) which lead to your service url.
You also need to save the `Client ID` and `Client Secret` from this page for your configuration(`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`).

![githubsetting.png](https://i.loli.net/2020/06/07/YG7Iv3jxgPfDnHu.png)

## Start dev service

```sh
yarn dev
```

## For Api User

### API Info

The API structure was edited and saved in file: [./openapi.yml](./openapi.yml).

You can use Swagger Editor([http://editor.swagger.io/](http://editor.swagger.io/)) to preview it.

![swagger.png](https://i.loli.net/2020/06/07/E3khLdoDCmlyfVP.png)

### Authentication

We use JWT tokens to decide whether a request is valid. After a logout request, the token will be invalid.

- How to get token

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

- Valid request

Except `/auth/login`, `/auth/github`, and `/auth/github/callback`, every api needs a HTTP header(`Authorization`) with a valid bearer token to make a valid request.

```text
Authorization:  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWVkYzgzMjg4NDZlMmI3NzkyOGE3NDU0IiwidHlwZSI6InBhc3N3b3JkIiwic2Vzc2lvbiI6IjVlZGM4MzgyODQ2ZTJiNzc5MjhhNzQ1NiIsImlhdCI6MTU5MTUwOTg5MCwiZXhwIjoxNTkxNTk2MjkwfQ.Rjh5QOmgVZOv1fND6PbuF2O8iEeME658GpC-9D-SPtU
```

- Github OAuth login

We provide Github Oauth login in the service to exsited users with github information.

The front end client can use the link of api `/auth/github`. This link without any parameters will redirect to a Github Oauth link about a Github account information access. Authorization of this Oauth will automatically redirect to a callback link `/auth/github/callback` with Github access token. The service will request Github account information with this token. If Github return the user's login name which can match some user's github info in our service, we will pass the login with JWT token information.
