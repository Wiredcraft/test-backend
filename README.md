# User APIs

Dependencies:

- Node.js: v9.3.0
- MongoDB: v3.2.15

### Installation

```shell
npm install
```

### Start Server

```shell
npm start
```

###  Docker

```shell
docker-compose up --build
```
### Test

```shell
npm run test
```

### Lint the code

```shell
npm run eslint
```

#### API

| Method | URI                     | Description                                |
| :----: | :---------------------- | :---------------------------------------   |
|  GET   | /api/users/             | Get list users (authorization required)    |
|  GET   | /api/users/:id          | Get user by id (authorization required)    |
|  POST  | /api/users/             | Create new user (SignUp)                   |
|  PUT   | /api/users/:id          | Update User by id (authorization required) |
| DELETE | /api/users/:id          | Delete user by id (authorization required) |
|  POST  | /api/users/login        | Login                                      |

##### Note: you can import [wiredcraft-api.postman_collection.json](https://github.com/BigaDev/test-backend/blob/master/wiredcraft-api.postman_collection.json) into POSTMAN v2 to try APIs.
