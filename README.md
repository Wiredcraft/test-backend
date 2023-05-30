# TEST Service

## Project guide
In this project, you'll see the following Midway based practice case (the upper layer uses egg.js)
Midway is based on TypeScript development and combines OOP + Class + IoC. midway is similar to nestjs in its design concept

The capabilities supported by Test Service
| ability       | Name                                   | progress  |
| :------------- | -------------------------------------- | :---: |
| **overview**   |                                        |       |
|                | Controller                             |   ✓   |
|                | Services and Refilling                 |   ✓   |
|                | Request, response, and application     |   ✓   |
|                | Web middleware                         |   ✓   |
|                | start and deploy                       |   ✓   |
| **Basic ability**   |                                   |       |
|                | Dependency injection                   |   ✓   |
|                | Operating environment                  |   ✓   |
|                | Multi-environment configuration                                             |   ✓   |
|                | Parameter checksum conversion          |   ✓   |
|                | Life cycle                             |   ✓   |
|                | Component                              |   ✓   |
|                | Logger                                 |   ✓   |
|                | Debug                                  |   ✓   |
|                | Test                                   |   ✓   |
| **enhance**       |                                     |       |
|                | Cache (Redis)                          |   ✓   |
|                | Database(TypeORM)                      |   ✓   |
|                | MongoDB                                |   ✓   |
|                | Swagger                                |   ✓   |
| **Web**    |                                         |       |
|                |      CORS                               |   ✓   |
| **microservice**     |                                         |       |
|                | RabbitMQ                               |   ✓   |
| **Common ability**   |                                         |       |
|                | Token Authentication                  |   ✓   |
|                | Authentication middleware             |   ✓   |
|                | Interface response statistics middleware|   ✓   |
|                | Unified error handling                  |   ✓   |
|                | SnowFlake                               |   ✓   |
|                | Jaeger                                   |   ✓   |



## Usage

The following environmental support is required to run the project
- Mongo
- Redis
- Jeager

Installation dependency by docker
```
docker-compose up -d
docker-compose down
```

Initializing db
```
docker exec -it mongo mongosh admin
use admin
db.auth('admin','admin')
use test
db.createUser({user:'admin',pwd:'123456',roles:[{role:'readWrite',db:'test'}]})

```

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy
```
$ npm start
$ npm stop
```

### npm scripts
* Use `npm run lint` to check code style.
* Use `npm test` to run unit test

## Redis
- Access using Redis as user login credentials

### Redis partition

- `user:accessToken:${id}` Cache user Token information
- `user:userinfo:${id}` Cache user basic information


## Jaeger

Jaeger [OpenTracing] (https://opentracing.io/docs/)

This implementation is based on the ctx mechanism and combined with midway's dependency injection to realize non-intrusive spanContext delivery
- Implements interface-level sampling by default
- span can be manually managed if small particle size sampling is required
  ```ts
  ctx.tracerManager.startSpan('SpanName1')
  await doSomethine()
  ctx.tracerManager.finishSpan()
  ```

## Interface document
```bash
open http://127.0.0.1:7001/swagger-ui/index.html#/
```


## Unit testing
The unit test framework is [Mocha](https://mochajs.org/).
Support the case for `. Skip () ` `. Only () ` combination of optional * * * * and * * * * to achieve fast,
Suitable for scenarios involving complex, coupled business projects
