# Wiredcraft Back-end Developer Test

## Context

Build a RESTful API that can `get/create/update/delete` user data from a persistence database

### User Model

```
{
  "id": "xxx",                  // user ID 
  "name": "test",               // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "createdAt": ""               // user created date
}
```

## Installation

First install Node.js and MongoDB. Then:

```bash
npm install
```

## Getting Started

```bash
npm start
```

## API

### Some HTTP Status

```
200 ok
201 ok, created
204 ok, no content
400 bad request, like validate error
401 unauthorized
404 not found
500 server error
```

### Details

#### Login

```
POST /login HTTP/1.1
Content-Type: application/json
{
    "user": "admin",
    "password": "123456"
}

Response Body Like:
{
    "access_token": "xxx...",
    "token_type": "bearer",
    "expires_in": 7200
}
```

The `access_token` should use in Authorization header. Like:

```
GET /users HTTP/1.1
Host: localhost:3000
Authorization: Bearer xxx...
```

#### RESTful User API

```
GET      /users       get user list
GET      /users/:id   get user info
POST     /users       create user
PUT      /users/:id   update user
DELETE   /users/:id   delete user
```

## Test

```bash
npm test
```

