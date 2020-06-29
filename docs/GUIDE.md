<h1 align="center">Wiredcraft Backend Test Document</h1>
<div align="center">
  <strong>Backend Development Evaluation Test</strong>
</div>
<br />

## Table of Content
* [Deployment](#deployment)
* [Development](#development)




## Development
For testing, and development purpose, you can follow these instructions to build and run the application

### Prerequisites
1. Install `Node 10+`
2. MongoDB server running, you can run `docker-compose up -d database` in the project root to start a mongodb 4 instance.

### Steps
1. Run `make env` in the project root to set the default environment variables to .env
2. Run `yarn install` in the project root to install dependencies
2. Run `yarn start` to start the application on PORT 3333 by default.
3. (Alternatively) Run `yarn test` to run Unit tests, `yarn test:e2e` to run end to end tests and `yarn test:cov` to run Unit tests with a coverage report.
4. Once the application is running, you may use various `*.rest` files to send requests to the application
5. Note: The `.rest` files have the port hard coded, if you changed the port, you must change these to reflect those changes

## Deployment
To deploy this service or to run it as a closed unit, a Dockerfile with a related docker-compose file is attached.

1. Run `make env` - This checks to see if you have an .env file in the base directory, if not, it copies the sample.env file. You may edit this file to fit your special case. Example add `APP_PORT=XXXX` If you want to run the application on a custom port. Default is `3333`.
2. Run `make run` - This builds and runs the application exposed on PORT 3333.
3. Visit [localhost:3333/healthcheck](http://localhost:3333/healthcheck) to see the application live
