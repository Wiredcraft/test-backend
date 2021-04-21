# Wiredcraft Back-end Developer Test

This project is an assignment from Wiredcraft. 

It allows storing and accessing user and friend entries via a REST API.

## Start of the project

1. Start the PostgreSQL database
   
   `docker-compose up`
   
2. Install the dependencies
   
   `yarn install`
   
2. Start the application, will be available on port 3000
   
   `yarn start`
   
## API documentation

The API documentation is available after starting at http://localhost:3000/api.
The general routes available:

```
POST    /user
GET     /user
GET     /user/{id}
PATCH   /user/{id}
DELETE  /user/{id}
GET     /user/{id}/friend
GET     /user/{id}/friend/nearby
POST    /user/{id}/friend/{otherUserId}
DELETE  /user/{id}/friend/{otherUserId}
```

## Architecture

This project uses the onion architecture which allows for maintainability.
Please check out the `documentation/architecture.md` for further informations.


## Running tests

### Unit tests

Run as following `yarn test`.

### End2end tests

To run the E2E tests, please create the database `wiredcraft-test` in your local PostgreSQL.
Further on, activate the PostGIS extension in that database:

`CREATE EXTENSION postgis;`

Then run tests with `yarn test:e2e`
