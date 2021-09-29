## Deploy

```
$ npm run dev

```

## Directory Structure

### config
> config json based on environment

### sql
> database schema.sql and curn.sql file
### src/app.js
> application entry file

### src/router.js
> application router file

### src/modules
> source code directory

#### core
> common log and error define
#### models
> database table shema define
#### user/*
##### controllers.js
##### filter.js 
##### router.js
##### service.js
##### spec.js: test case file
##### validatio.schemas.js: API request params or body schema define


## API

### POST /user
body:

| field | Type| Required | Default | Description |
| ------- | ------- | ------- | ------- |------- |
|   name      |   string(64)      |  Yes       |  NULL       |  user name      |
|   dob      |   date      |  Yes       |  NULL       |  date of birth      |
|   address      |   json      |  Yes       |  NULL       |  user address      |
|   description      |   string(256)      |  No       |  NULL       |  user description      |
|   createdBy      |  int(11)     |  No       |  NULL       |  user created by      |
|   updatedBy      |    int(11)      |  No       |  NULL       |  user updated by      |
|   createdAt      |   date      |  Yes       |  NULL       |  user created date     |
|   updatedAt      |   date      |  Yes       |  NULL       |  user updated date     |
|   status      |   int(2)       |  Yes       |  1       |  user status: 0 invalid 1 valid    |


### GET /user/list
params:

| field | Type| Required |  Description |
| ------- | ------- | ------- |------- |
|   keywords      |   string     |  No       |   queury keywords      |
|   sort      |   string      |  No       |   sort string     |
|   order      |   string      |  No       |   DESC or ASC      |
|   orderBy      |   string      |  No       |  query order by filed      |

### GET /user/pages
params:

| field | Type| Required |  Description |
| ------- | ------- | ------- |------- |
|   pageIndex      |   int     |  No       |   queury page index from 1      |
|   pageSize      |   int     |  No       |   queury page size of each page     |
|   keywords      |   string     |  No       |   queury keywords      |
|   sort      |   string      |  No       |   sort string     |
|   order      |   string      |  No       |   DESC or ASC      |
|   orderBy      |   string      |  No       |  query order by filed      |

### GET /user/:id
params:

| field | Type| Required |  Description |
| ------- | ------- | ------- |------- |
|   id      |   int(11)     |  Yes       |   queury user id     |

### PUT /user
body:

| field | Type| Required | Default | Description |
| ------- | ------- | ------- | ------- |------- |
|   name      |   string(64)      |  No       |  NULL       |  user name      |
|   dob      |   date      |  No       |  NULL       |  date of birth      |
|   address      |   json      |  No       |  NULL       |  user address      |
|   description      |   string(256)      |  No       |  NULL       |  user description      |
|   createdBy      |  int(11)     |  No       |  NULL       |  user created by      |
|   updatedBy      |    int(11)      |  No       |  NULL       |  user updated by      |
|   createdAt      |   date      |  No       |  NULL       |  user created date     |
|   updatedAt      |   date      |  No       |  NULL       |  user updated date     |
|   status      |   int(2)       |  No       |  1       |  user status: 0 invalid 1 valid    |

### DELETE /user/:id
params:

| field | Type| Required |  Description |
| ------- | ------- | ------- |------- |
|   id      |   int(11)     |  Yes       |   queury user id     |

### GET /user/checkName
params:

| field | Type| Required |  Description |
| ------- | ------- | ------- |------- |
|   name      |   string(64)      |  Yes       |   check name is unique or not by name field     |

### GET /user/nearBy
params:

| field | Type| Required |  Description |
| ------- | ------- | ------- |------- |
|   name      |   string(64)     |  Yes       |   get users near by which named 'name' user  and near distance   |
|   distance      |   double     |  Yes       |   get users near by which named 'name' user   and ner distance |


