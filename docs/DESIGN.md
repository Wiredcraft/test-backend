<h1 align="center">Wiredcraft Backend Test Document</h1>
<div align="center">
  <strong>Backend Development Evaluation Test</strong>
</div>
<br />

## Table of Content
* [Architecture Overview](#architecture-overview)
* [Considerations](#design-considerations)
    * [Framework](#framework)
    * [Data Layer](#data-layer)
    * [Logging](#logging)
    * [Testing](#testing)
    * [Security](#security)
    * [Authentication](#auth)
    * [Drawbacks](#drawbacks)
* [Deployment](#deployment)
* [Development](#development)

## Architecture Overview
* Framework - NestJS w/ TypeScript Flavor
* HTTP Layer - ExpressJS
* Data Layer - MongoDB w/ Mongoose ODM
* Configuration - dotenv w/ Joi Validation
* Testing - Jest
* Deployment - Docker


## Design Considerations
Here are the design considerations for this project grouped by responsibility.
### Framework
The selected framework of choice for this project is [NestJS](https://github.com/nestjs/nest) setup with the TypeScript flavor.
NestJS offers an extensible outline for building scalable NodeJS services. It follows a similar paradigm to popular non-js frameworks
like Rails and Laravel which makes it quite fun to work.

In addition, NestJS is modular and allows developers to set up and build their projects with whichever tools they see fit.


### Data Layer
The database of choice is MongoDB using the Mongoose ODM.

### Logging
Logging is handled using Winston & Morgan. Winston for log management and morgan for request logging.
Logs are written to a number of `*.log` files depending on the log level. They are also all written to standard output both locally and 
in production. This is useful when deploying to AWS or inside a docker container where the logs are read from standard output and 
delivered to the appropriate logging agent. 

The Nest Logger is a pretty standard Logger class with a number of log levels available; `info`, `debug`, `warn`, `error`, `verbose` with an additional helper to set the log context.
The setContext function is handy for having scoped logs while allowing you to treat the logger as an injectable service. It is also possible to create new log objects for use in functions that don't use dependency injection.

The log format of choice is JSON as its universal enough to be used by a number of different consumers.

Refer to [LOGGING.md](LOGGING.md) for more details on logging strategy.

### Testing
Testing is achieved with Jest for both unit tests and end-to-end tests. Also included is a number of `.rest` tests for quick runs
of the API endpoints.

### Security
The primary security package used in this project is helmet. It protects against a number of common HTTP vulnerabilities. Read more [here](https://helmetjs.github.io/).
In addition to helmet, rate-limitters and CORS have been enabled on the service to control access and prevent from DDOS attacks.

### Auth
For authentication, we'll make use of JWT with passports local and jwt strategies. Refer to [AUTH.md](AUTH.md) for more details on authentication. 

### Drawbacks
There are a few drawbacks with this approach. The first is with NestJS, although NestJS is a great tool, it has its way of doing things.
The Nest way, and even though this can be bypassed, it introduces a bit of overhead for new users of the framework. Its extensibility is great
but again introduces some overhead for new developers as they have to understand how NestJS tackles its problems.

NestJS is an overall great framework and just like Rails and Laravel, it introduces its users to best practices when building APIs.

## Development
Refer to [GUIDE.md](GUIDE.md)

## Deployment
Refer to [GUIDE.md](GUIDE.md)
