# A General User Management Service

### Development environments

* nodejs (version 12 or later)
* mongodb (version 4 or later)
* docker

## Preparing database

```bash
# create mongodb
npm run db:init
```

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev
```

```
# build
npm run build

# production mode
npm run start:prod
```

## Test

```bash
# tests
npm run test

# test coverage
npm run test:cov
```

## Configuration

The system can be configured through environment variables

| name | default | description |
| ---- | ------- | ----------- |
| APP_PORT | 3000 | the port this system listens to |
| DATABASE_CONNECTION_URI | mongodb://localhost/users-service-development | the mongodb to use |
| AUTH_APP_ID | cookding | the application id used in the HMAC Auth Strategy |
| AUTH_APP_SECRET | should_change_in_prod | the application secret used in the HMAC Auth Strategy |
| AUTH_HMAC_ALGORITHM | sha256 | the hash algorithm used in the HMAC Auth Strategy |
| AUTH_TIMESTAMP_TOLERANCE_IN_MS | 300000 | timestamp 300000 ms before or after current time will fail the HMAC Auth Strategy |

## Documents

* [Design documents](./docs/README.md)
* [API Reference](./docs/api/README.md)
