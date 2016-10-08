# Wiredcraft Back-end Developer Coding Test

### User Model

```
{
  "id": "xxx",                  // user id(you can use uuid or the id provided by database, but need to be unique)
  "name": "test",               // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "created_at": ""              // user created date
}
```

### API

#### User model
```
GET    /user/{id}                   - Get user by ID
POST   /user/                       - To create a new user
PUT    /user/{id}                   - To update an existing user with data
DELETE /user/{id}                   - To delete a user from database
```

#### Authentication

```
`Authorization Beaer <token>`
```

You can obtain a token by querying

`GET /auth/token/:id` where id is the id of one of the user in the database
This will give you with a json response with a token. You can use that token in the Authorization header.



## Requirements

* Use CouchDB
* --Use Loopback--

## How to run?

`pm2 start index.js`

Install pm2 on your system if you don't have it
`npm install -g pm2`

## How to test ?

`npm test`

## Continuous integration on Travis

https://travis-ci.org/sylvainv/test-backend

## Features