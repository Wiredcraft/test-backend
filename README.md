# WC RESTful API

## Introduction

This project is a simple RESTful API built using NodeJS, KOA, Typescript and TypeORM as an ORM for MongoDB. Middleware uses JWT, CORS, Winston Logger. Swagger API docs are used to produce an api front-end.

### Tools
- Node.js (v12.x.x)
- NPM (v6.x.x) 
- Typescript
- KOA Framework v2
- MongoDB 4 with TypeORM
- Winston (logging)
- Swagger-UI (documenting the API)
- Mocha, Chai, Supertest (unit and integration tests)
- NYC (code coverage)
- ESlint, Prettier (code formatting)

### Why use KOA to build API Servers?

Koa was built by the same team behind Express, and is a smaller, more expressive, and more robust foundation for web applications and APIs. It has the following advantages:
- Koa improves interoperability, robustness, and makes writing middleware much more enjoyable.
- Has a large number of helpful methods but maintains a small footprint, as no middleware are bundled.
- Koa is very lightweight, with just 550 lines of code.
- Better error handling through try/catch.
- Generated-based control flow.
- No more callbacks, facilitating an upstream and downstream flow of control.
- Cleaner, more readable async code.

## Setup

### Requirements
- Node.js version >= 12
- npm version >= 6
- docker and docker-compose (to run the mongodb db in localhost)

### Setup
- install dependencies:
  ```bash
  npm install
  ```
- setup the `.env` file. Edit the environment variables inside accordingly:
  ```bash
  cp .env.example .env
  ```
- start the mongodb container in docker:
  ```bash
  sudo docker-compose up
  ```
### Start

- for development:
  ```bash
  npm run watch-server
  ```
- for deployment on local host:
  ```bash
  npm run build
  npm start
  ```
### Test
- to run integration tests:
  ```bash
  npm test
  ```
### Coverage
- to run code coverage:
  ```bash
  npm run coverage
  ```

## Project Structure
- The project is written in Typescript. After Typescript compiles, all subsequently built javascript files are in `/dist`
- The entry point for the server is `src/server.ts`
- Program flow: `server` --> `routes` --> `controllers` --> `entities`
- `Entities` are defined with and validated by TypeORM
- Tests are in the `test` folder and only contain integration tests

### RESTful Endpoints
Documentation for these endpoint can be found at /swagger-html
- POST......... /users
- GET.......... /users
- GET.......... /users/:id
- PUT.......... /users/:id
- DELETE....... /users/:id


