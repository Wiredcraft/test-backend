# Wiredcraft Back-end Developer Test - Users API

## Description

RESTful API to `get/create/update/delete` users from a persistence database. 

### Tech stack

- Node.js and Express.
- MongoDB.


### User Model

```
{
  "id": "xxx",                  // user ID (ObjectID provided by database, unique)
  "name": "test",               // user name
  "username": "test",           // username for managing authentication
  "password": "test",           // password for managing authentication
  "name": "test",               // user's name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "createdAt": ""               // user created date
  "updatedAt": ""               // user updated date
}
```

### Documentation and deployment
[Swagger](https://swagger.io/) is used for documenting endpoints. This documentatation can be found at `/docs` of the base path (e.g. `http://localhost:3000/docs`) [here](http://ec2-18-216-148-32.us-east-2.compute.amazonaws.com:3000/api/docs/) for a live demo. All endpoints can be found there. This API uses and requires a few env variables (that can be stored in a `.env` file) listed bellow:
- `NODE_ENV`: (*default: development*) this is the usual environment variable, this API is thought to use 3; `development`, `production` and `test`
- `BASE_PATH`: (*default: /*) this is the main route for the API, it should end always with `/`
- `PORT`: (*default: 3000*) port in which the API would run
- `PWD_SECRET`: (*default: random 16 bits hex string*) this is the salt used to encode and compare passwords. It is not required but if none is provided then passwords won't match after restarting the API.
- `JWT_SECRET`: (*REQUIRED*) this is the salt used to encode JWT
- `MONGO_HOST`: (*REQUIRED*) MongoDB host url

For deploying this project just `npm install` and `npm start` with the required env variables, it is adviced to store them in a `.env` file for simplicity.

### Unit tests
A BDD approach is used in order for creating tests, [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/) help with that. Just `npm run test`, usually done with a different database in order to avoid any inconsistencies with the data.

### Commit messages
_*If applied this commit will*_ is the mantra for commits messages, inspired by [this](https://chris.beams.io/posts/git-commit/) article.

### Online demo
An already deployed production instance demonized with [pm2](http://pm2.keymetrics.io/) can be found [here](http://ec2-18-216-148-32.us-east-2.compute.amazonaws.com:3000/api/docs/)

### User authentication
Simple authentication using username + password that retrieves a token that should be used for protected resources. The flow is the following:
- User is created using the `POST /users` endpoint
- User is authenticated using the `POST /sessions` endpoint
- `token` returned should be add as `Authorization` header with the word `Bearer` as prefix, e.g: `Authorization: Bearer xxxxxxxxxxxxxx` 

### Logging strategy
When env is set to development this API (with the help of [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)) logs everything happening in the request, from the method used to the status code, body, headers and even response time.

### TODO: Use seneca
