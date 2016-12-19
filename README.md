# Wiredcraft Back-end Developer Coding Test

## Setup

Have a mongodb server running.
```npm install
```

## Start server

```js
node .
```

## Configuration

You can adapt the config.json or use arguments when starting up the server.
Accepted arguments are:
- server:port
- db:host
- db:port
- db:name
- db:test
- db:login:user
- db:login:pass

## Run tests

```js
npm test
```

## API

```
GET    /user/{id}                   - Get user by ID
POST   /user/                       - To create a new user
PUT    /user/{id}                   - To update an existing user with data
DELETE /user/{id}                   - To delete a user from database
```

## User Model

```
{
  "id": "xxx",
  "name": "test",                       // required
  "dob": "DD/MM/YYYY",
  "address": "",
  "description": "",
  "created_at": ""                      // read-only
}
```
