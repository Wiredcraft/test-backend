# Guide for Developers

## Prerequisite

- curl
- jq (optional)
- Node.js: 14.4.0
- Redis: 6.0.4
- MySQL: 5.7.29

## Get Started

_1_. Download:

```
git clone https://github.com/bsdelf/test-backend
```

_2_. Install dependencies:

```
npm i
```

_3_. Create MySQL databases:

```sql
CREATE DATABASE playground CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE playground_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

The first one will be use during development, the seconds one is for unit test.

_4_. Create config files for development and test:

```
touch config/config.local.yaml
touch config/config.local.test.yaml
```

The content of the first config as follows:

```yaml
providers:
  sequelize:
    username: 'user name'
    password: 'user password'
    database: 'playground'
```

The content of the second config as follows:

```yaml
providers:
  sequelize:
    username: 'user name'
    password: 'user password'
    database: 'playground_test'
```

If there is no password for your database account, set password to `null`.

_5_. Execute migrations:

```
npm run cli:dev migration:init
npm run cli:dev migration:up
```

_6_. Run unit test:

```
npm run test
```

_7_. Start API server with a swagger front page:

```
npm run http:dev -- --swagger
```

To examine available APIs, open this link: [http://127.0.0.1:3000/documentation](http://127.0.0.1:3000/documentation)

## Development

### Config

When you start an application, a portion of config files under `./config` folder will be read, stacked, and merged into a single config object based on `NODE_ENV`.

For development environment, these configs are:

1. config.default.yaml
2. config.development.yaml (optional)
3. config.local.yaml (optional, highest priority)

For unit test, these configs are:

1. config.default.yaml
2. config.test.yaml (optional)
3. config.local.test.yaml (optional, highest priority)

Use this command to inspect the merged config object:

```
npm run cli:dev config:dump
```

### Migrations

Create new migration in `./src/migrations`:

```
npm run cli:dev migration:create -- --name add-table
```

Apply all pending migrations:

```
npm run cli:dev migration:up
```

Undo the most recent migration:

```
npm run cli:dev migration:down
```

### Use Evaluation Data

Create users with API requests is quite tedious. Luckily, there is a shortcut in this project:

```
npm run cli:dev user:fill
```

The above command will generate 10 users with password "12345678".

Now let's get token for the first user (user-1@gmail.com):

```sh
curl \
-v http://localhost:3000/v1/user-tokens \
-H "Content-Type:application/json" \
-X POST -d '{"email":"user-1@gmail.com","password":"12345678"}'
```

Sample output:

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsImlhdCI6MTU5MTkyNjc4MX0.2awRKigAFCb49sbNsdd8vUe1S1A7mbh53q5H_YO20Uo",
    "userId": 56
  }
}
```

Remember the user ID (in our case is 56), it will be used later. Now export token for this user:

```sh
export TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsImlhdCI6MTU5MTkyNjc4MX0.2awRKigAFCb49sbNsdd8vUe1S1A7mbh53q5H_YO20Uo
```

Make API request:

```sh
curl \
 -v http://localhost:3000/v1/users \
 -H "Content-Type:application/json" \
 -H "Authorization: Bearer ${TOKEN}"
```

Make user specific API request:

```sh
curl \
 -v http://localhost:3000/v1/users/56/followings \
 -H "Content-Type:application/json" \
 -H "Authorization: Bearer ${TOKEN}"
```

### User Authentication

Basic access authentication is employed by this project. The authenticate flow as follows:

1. Client: use email and password to request a token.
2. Server: verify the request. On success, create a session in Redis, and return a token which has user ID and session ID encrypted in.
3. Client: use the returned token for further requests.
4. Server: validate requests in following steps:
   1. Verify token
   2. Verify session
   3. If there is an `:id` component in API, compare `:id` against the actual user ID (which is stored in user session and token payload, both of them can be trusted).

Currently, following APIs don't need authentication:

- GET /health
- POST /v1/users
- POST /v1/user-tokens

#### Session Expire Strategy

Session expire can be triggered by:

- Update user password.
- Session expire cron job.
- Session expire command.
- Clear Redis keys.

To start session expire cron job:

```sh
npm run cron:dev
```

The cron job will expire user sessions created before 30 days at 03:01 every day.

To expire all sessions:

```sh
npm run cli:dev user:session:expire -- --days=0
```

#### RBAC

The `role` field in user model and session is reserved for RBAC. It is unused at this moment.

## Architecture

![architecture](arch.svg)