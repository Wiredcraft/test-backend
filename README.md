# Wiredcraft Back-end Developer Coding Test

Make sure you read **all** of this document carefully, and follow the guidelines in it.

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
GET    /user/{id}                   - Get user by ID
POST   /user/                       - To create a new user
PUT    /user/{id}                   - To update an existing user with data
DELETE /user/{id}                   - To delete a user from database
```
### How to test ?

You need to have CouchDB install on your machine to run the test http://couchdb.apache.org/.

`npm test`

To use continuous integration you can check Travis https://travis-ci.org/sylvainv/test-backend/branches

### Start server

`npm start`
