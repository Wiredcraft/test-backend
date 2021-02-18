# Test Backend from WiredCraft

## Overview

This is the test-backend project from Wiredcraft for a general `user` "microservice". 

---

## Quick Notes regard to the reqs
Supported APIs are:
 - GET /users
 - GET /users/:username 
 - GET /users/:username/follower
 - POST /users
 ```json
 // Create a user
 {
    // sample body
    "name": "username",
    "password": "password",
    "address": "1234 Main St",
    "description": "test description"
 }
 {
    // sample response
    "errCode": -1,
    "data": 1 // created userId, actual return value may vary from business needs
 }
 ```
 - POST /users/delete 
 ```json
 // Delete a user by username,
 {
   // sample body
   "username": "username"
 }
 {
   // sampe res
   "errCode": -1
 }
 ```
 - POST /users/follow
 ```json
   // follow a user
 {
   // sample body
   "username": "username",
   "follower": "follower"
 }
 {
    // sample err res
    "errCode": 10008,
    "msg": "can not follow or get followed by void"
}
 ```
 - POST /users/unfollow
 ```json
 // unfollow a user
 {
   // sample body
   "username": "435",
   "follower": "follo123wer"
 }
{
   // sample err res 
    "errCode": 10010,
    "msg": "given following relation does not exist"
}
 ```
 - PATCH /users/info
 ```json
{
   // sample body
    "name": "follower",
    "address": "new address"
}
 {
    // sample res
    "errCode": -1,
    "data": {
        "id": 47,
        "name": "follower",
        "dateOfBirth": null,
        "address": "new address",
        "description": "test description"
    }
}
 ```
 - PATCH /users/password
```json
{
   // sample body
    "name": "follower",
    "oldPassword": "password",
    "newPassword": "newpwd"
}
{
   // sample res
   "errCode": -1
}
```
Responses example,
```json
{
   "errCode": -1, // Shared property for all res, -1 on success, positive pre-defined code for error
   "data": {}, // Optional field for success response, if data needed
   "message": "string" // err message if any, for Error Response
}
```
You might have noticed that the `api routes` are lacking auth middleware that protects those who needs a guard, it's simply because auth/login is not implemented, does not mean that those APIs do not need auth protection.

---

## Dependencies

As I have not tested for version compatibilities, assume the latest version of following would work. 
 - typescript/ts-node
 - docker(for mysql)
 - jest/ts-jest
 - pm2
---
## How

   - docker-compose for local mysql
   - `yarn dev` for start in dev(watch) mode
   - `yarn prd` for prd using pm2, logging saves to ./logs
---
## Database

### User Schema
|  column   | type  |
|  ----  | ----  |
| id  | int pkey |
| name  | varchar |
| password  | varchar |
| address  | varchar |
| description  | varchar |
| date_of_birth  | date |
| deactivated_at  | timestamp |
| created_at  | timestamp |
| updated_at  | timestamp |

- Added a new column deactivated_at in case of `freeze`,  or `soft delete` purposes.

### User Mapping
|  column   | type  |
|  ----  | ----  |
| id  | int pkey |
| user_id  | int |
| follower_id  | int |
| created_at  | timestamp |

- It has a unique index constraint on (user_id, follower_id) to make sure duplicated user mapping relations are avoided.
- no fkeys are added as foreign relation is preferred to be handled in business logics
---

