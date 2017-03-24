# Wiredcraft Back-end Developer Coding Test

## Initialization & Test

### Installation

Clone the project to local drive, execute the following command to install dependencies

```shell
npm install
```

Dependencies:

- Node.js: V 7.7.4
- MongoDB: V 3.2.0

### Start Server

Use the following command to start the server

```shell
npm run server
```

After server started, there will be expot the port 4020 on the machine as the backend service, to explorer the apis can visit the [API Explorer](http://0.0.0.0:4060/explorer), From the explorer there is a list of the exposed apis.

### Test

#### Lint the code

```shell
npm run lint
```

This will use [StandardJS](https://standardjs.com/) as the libiary lint the code styles in server folder.

#### Post check on Code

```shell
npm run posttest
```

This will use [nsp](https://github.com/nodesecurity/nsp) to detect [known vulnerabilities](https://nodesecurity.io/advisories/) in the server code.

>  In post check will include test `lint`

### Integration Test

1. Start server for test
   In Test mode data will exist in memory instead persistent in database.

   ```shell
   npm run server-test
   ```

2. Start test work

   ```shell
   npm run test
   ```

   > In the test it will include `posttest`

### Implementation

#### User Model

```javascript
{
"id": "String",         // user's id
"user_name": "String",  // user's user name used during login
"password": "String",   // encrypted user's password(hidden from user)
"salt": "String",       // encrypt salt used to encrypt user's password(hidden from user)
"name": "String",       // user's name
"dob": "Date",          // user's date of birth
"address": "String",    // user's address
"created_at": "Date",   // record created time
"modified_at": "Date"   // record modified time
}
```

The `user_name`, `password`, `salt` and `modified_at`are added beyond the original test requirement, to complete the login/logout task and complete the infos of tracking in future.

#### API

| Method | URI                     | Description                              |
| :----: | :---------------------- | :--------------------------------------- |
|  GET   | /api/users/{id}         | Get user by id                           |
|  POST  | /api/users/             | Create new user                          |
|  PUT   | /api/users/{id}         | Update User by id (user can only edit their slef data after login) |
| DELETE | /api/users/{id}         | Delete user by id                        |
|  POST  | /api/users/{id}/replace | Same to PUT /api/users/{id} (Loopback framework effect) |
|  POST  | /api/users/login        | Login specific user with `user_name` and `password` |
|  POST  | /api/users/logout       | Logout currently logined user(base on accessToken) |

## Notes

Loopback has build in models can easily complete the task in this test.

* Loopback have build in `User` model, with username, email, password and etc.
* Loopback have build in `AccessToken` model, to record the users logined info.

Loopback allow to inherit from other models and overwrite the existing method to do polymorphism.

To me, i think the implementation with the build-in User and AccessToken are kind of cheat for this test, so all the model in this test are based on loopback's `PersistedModel` which is the base model for loopback other models.

In this test during login part i use _Secure Salted Password Hashing_ to encrypted user's password in database, and use [uuid](https://github.com/kelektiv/node-uuid) to generate the logined user's token to verify, the verification has borrow some of the loopback lib code to make it can works in Loopback framework way.

Beside this i did the following to make the code be easier to expand and more friendly to end users.

* Create based model `WBase` to deal with general meta infos like `created_at` and `modified_at`
* Customized the error that response to users of the API with more useful infos.

The test of this test is based on [AVA](https://github.com/avajs/ava) and complete the API's integration test, the reason for this approach list below

* AVA is a [BABEL](https://babeljs.io/) build-in test library, with that i can write complex test login easily.
* AVA has a better performance than mocha.
* AVA use simple assert to do test.
* Compare to Unit Test, Integration Test are more imporntant to make sure the API works in an expected way.
