# Readme

## Project Information

- This project is the test backend for Wiredcraft, it provided CURD operations for user data. At the same time, ut and API document is also provided for this feature.

## Tech stack

- Using Koa as framework
- Using MogonDB as DB
- Using JsDoc as in-code coments
- Using swagger + redoc as API document
- Using mocha to do e2e test cases

## Quick Start

- env: 1.You should start MongoDB locally

### How to start this project

- npm ci
- npm run start

### How to do test

- npm run test

## Code Structrue

```
.
+-- common // Contants
|   +-- error // Common server error
|   +-- types // Types for jsdoc
+-- lib // Bottom Library
|   +-- http // Http client
|   +-- log // Logger
|   +-- mongo // Controller for Mongo init/connect/shutdown
+-- middleware
|   +-- initHandler // some handlers for API requests that need to be handled consistently
|   |   +-- contextHandler // context handler to set request id and logoger into context
|   |   +-- errorHandler // error handler to catch some unexception http errors
|   |   +-- formatHandler // format handler to format http response
|   |   +-- logHandler // log handler to record Apis request and response info
+-- model
|   +-- core // generic model
|   +-- users // user model 
+-- router // controller
+-- test // test cases
+-- validation
|   +-- users // joi validation for uses
```

## DB Structrue

### user

- description: user info collection

|  key   | type  | comments |
|  ----  | ----  | ---- |
| _id  | object id | Mongo's object ID
| name  | string | user name
| dob | string | date of birth
| address | string | user address
| description | string | user description
| createdAt |  datetime | date-time of the document's last update
| updatedAt | datetime | date-time of the document was inserted

## Some Designs About Advanced Requirements

### friends

- description: friends collection

|  key   | type  | comments |
|  ----  | ----  | ---- |
| _id  | object id | Mongo's object ID
| masterId  | string | master id
| followerId  | string | follower id
| searchId |hash| Sort masterId&&followerId in dictionary order, then return hash
| createdAt |  datetime | date-time of the document's last update
| updatedAt | datetime | date-time of the document was inserted

### search the nearby friends

- redis: GeoHash
