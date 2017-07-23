# Wiredcraft Back-end Developer Coding Test


## Background

Build a restful api that could `get/create/update/delete` user data from a persistence database

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

```
GET    /users/{id}                   - Get user by ID
POST   /users/                       - To create a new user
PUT    /users/{id}                   - To update an existing user with data
DELETE /users/{id}                   - To delete a user from database
```

## Getting started

I choose MongoDB for persisting data, so before you running this application, please configure your **MongoDB** settings through `server/datasources.json`.

To run this application just clone this repository and install dependencies by following command
```
npm install
```
Then run this application by
```
npm start
```
The server will run on localhost on port 3000.

I've created an user(or say an admin role) to manage all the user data. Its credential is `fred@wiredcraft.com/p@ssw0rd`. All REST APIs of user can't be accessed without login. So in order to access these user APIs, you should follow the instructions below.

 1. Send a POST request to `http://localhost:3000/api/Admins/login` with `{ "email":"fred@wiredcraft.com", "password":"p@ssw0rd"}`, and get a response like

  >{
  > "id":"VD174tkKTtjIneCvtZnv566nuNqPexvQASbMXCviVOiJ2fNXgLJqDIdoC9pO4hqC",
  > "ttl": 1209600,
  > "created": "2017-07-17T13:29:43.416Z",
  > "userId": 1
  > }

 2. The **id** in above response could be used as an access token during subsequent REST request. Say, if you want to access `POST /users`, you can send a POST request to `http://localhost:3000/api/users/12?access_token=VD174tkKTtjIneCvtZnv566nuNqPexvQASbMXCviVOiJ2fNXgLJqDIdoC9pO4hqC` with no erros.

## Test
```
npm test
```


## Requirements

- Make sure you have [Node.js](https://nodejs.org/en/) installed.
- In order to run test, please make sure you've installed [mocha](https://mochajs.org/) as a global dependency through `npm install mocha -g`.
