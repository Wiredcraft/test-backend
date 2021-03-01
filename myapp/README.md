# Restful API for Wiredcraft User Table

## Running Environment:

* Nodejs 14.16.0
* Redis 6.2.0

## Install Steps:

* ```git clone https://github.com/eronekogin/test-backend.git```
* ```cd myapp```
* ```npm install```
* Providing a running configuration json file under ./config folder, an example is as follows:
```json
{
    "User": {
        // Set up redis connections, currently user name and password are not supported. 
        "dbConfig": {
            "host": "127.0.0.1",
            "port": "6379"
        },

        // Set up table names, you could customize it to any string you like.
        "USER_HASH_PREFIX": "userId",
        "USER_ID_SORTED_SET": "userIds",

        // Currently modifying allowed input fields are not supported.
        "USER_ALLOWED_INPUT_FIELDS": [
            "name",
            "dob",
            "address",
            "description"
        ]
    }
}
```
* Make sure you could connect to above the configured redis server.
* ```npm start```
* Then you will some similar messages as following:
```test
> myapp@1.0.0 start D:\nodejs\workspace\test-backend\myapp
> node ./bin/www

D:\nodejs\workspace\test-backend\myapp\bin
```
* Now go to ```http://localhost:3000/``` for a list of available apis for the
Wiredcraft User Table.

## Usages:

| Function | Get all user records |
| :-- | :-- |
| Link | ```http://localhost:3000/users?page={page}&pageSize={pageSize}``` |
| Method | GET |
| Parameters | The input page and pageSize parameters should be a positive integer |
| Return | The fetched user records will be returned as a json array |

---

| Function | Get a single user |
| :-- | :-- |
| Link | ```http://localhost:3000/users/{userId}``` |
| Method | GET |
| Parameters | The input userId should be a positive integer |
| Return | The fetched user records will be returned as a json object. |

---

| Function | Update a single user |
| :-- | :-- |
| Link | ```http://localhost:3000/users/{userId}``` |
| Method | PUT |
| Parameters | The input userId should be a positive integer |
| body | The body should contain a json object with the target update field and value |
| Return | A json object will be returned to tell the user if the update is successful |

---

| Function | Update a single user |
| :-- | :-- |
| Link | ```http://localhost:3000/users/{userId}``` |
| Method | DELETE |
| Parameters | The input userId should be a positive integer |
| Return | A json object will be returned to tell the user if the update is successful |

---

| Function | Update a single user |
| :-- | :-- |
| Link | ```http://localhost:3000/users/{userId}``` |
| Method | POST |
| Parameters | The input userId should be a positive integer |
| body | The body should contain a json object with the target create field and value |
| Return | A json object will be returned to tell the user if the update is successful |

---

| Function | Get all followings for a user |
| :-- | :-- |
| Link | ```http://localhost:3000/users/{userId}/followings?page={page}&pageSize={pageSize}``` |
| Method | GET |
| Parameters | The input page and pageSize parameters should be a positive integer |
| Return | The fetched user records will be returned as a json array |

---

| Function | Check if user is following the other user |
| :-- | :-- |
| Link | ```http://localhost:3000/users/{userId}/followings/{otherUserId}``` |
| Method | GET |
| Parameters | The input userId and otherUserId should be a positive integer |
| Return | A json object will be returned to tell if the user is following the other user |

---

| Function | Make user to follow the other user |
| :-- | :-- |
| Link | ```http://localhost:3000/users/{userId}/followings/{otherUserId}``` |
| Method | POST |
| Parameters | The input userId and otherUserId should be a positive integer |
| Return | A json object will be returned to tell if the user is following the other user now |

---

| Function | Make user to unfollow the other user |
| :-- | :-- |
| Link | ```http://localhost:3000/users/{userId}/followings/{otherUserId}``` |
| Method | DELETE |
| Parameters | The input userId and otherUserId should be a positive integer |
| Return | A json object will be returned to tell if the user is not following the other user now |

---

| Function | Get all followers for a user |
| :-- | :-- |
| Link | ```http://localhost:3000/users/{userId}/followers?page={page}&pageSize={pageSize}``` |
| Method | GET |
| Parameters | The input page and pageSize parameters should be a positive integer |
| Return | The fetched user records will be returned as a json array |

---

| Function | Check if the other user is a follower of user |
| :-- | :-- |
| Link | ```http://localhost:3000/users/{userId}/followers/{otherUserId}``` |
| Method | GET |
| Parameters | The input userId and otherUserId should be a positive integer |
| Return | A json object will be returned to tell if the other user is following the user |

---

| Function | Make the other user a follower of the user |
| :-- | :-- |
| Link | ```http://localhost:3000/users/{userId}/followers/{otherUserId}``` |
| Method | POST |
| Parameters | The input userId and otherUserId should be a positive integer |
| Return | A json object will be returned to tell if the other user is following the user now |

---

| Function | Make the other user to unfollow the user |
| :-- | :-- |
| Link | ```http://localhost:3000/users/{userId}/followers/{otherUserId}``` |
| Method | DELETE |
| Parameters | The input userId and otherUserId should be a positive integer |
| Return | A json object will be returned to tell if the other user is not following the user now |

---

| Function | Get all friends for a user |
| :-- | :-- |
| Link | ```http://localhost:3000/users/{userId}/followers?page={page}&pageSize={pageSize}``` |
| Method | GET |
| Parameters | The input page and pageSize parameters should be a positive integer |
| Return | The fetched user records will be returned as a json array |

---

| Function | Check if the other user is a friend of user |
| :-- | :-- |
| Link | ```http://localhost:3000/users/{userId}/friends/{otherUserId}``` |
| Method | GET |
| Parameters | The input userId and otherUserId should be a positive integer |
| Return | A json object will be returned to tell if the other user is a friend of the user |

---

## Design Patterns:

* This restful api is built with Express.js and use Redis as its database.
* It is tested with Jest and provides typicall restful api usages for Wiredcraft User Table.
* It uses log4js framework as its logger strategy.
* Generally it follows the traditional MVC pattern:
    * The web requests will first be forwarded to the controllers under controllers directory.
    * Then the controllers will validate the user input from the web requests and call the method in the database repositories to interact with databases.
    * Then the controllers will send back the response back to the client.

## Enhancements in the future:

* Add support for fetching the nearby friends.
* Categorize all logger messages into classes.
* Add version support. Currently all users are accessing the same version of api.
* Add User authentication and authorization with OAUTH 2.0.