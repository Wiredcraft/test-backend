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

## Test
```
npm test
```


## Requirements

- Make sure you have [Node.js](https://nodejs.org/en/) installed.
