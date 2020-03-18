## Users

### Create User

#### 1. Generate Auth Headers using [HMAC Auth Strategy](./authentication.md).

#### 2. Send HTTP request

```
POST /users
Headers
  - HMAC Auth Headers
Body
  - {
      "id": "miffyliye",
      "name": "MiffyLiye",
      "dob": "2012-12-31",
      "address": "China",
      "description": "DEV"
    }
```

Parameters

| Name | Required | Description |
| -- | -- | --|
| id | true | user id, it consists of alphabets and digits |
| name | false | user name |
| dob | false | date of birth, it should be in YYYY-MM-DD format |
| address | false | user address |
| description | false | user description |

##### Response

If the user is created, the response will be
```
Status
  - 201 Created
Body
  - {
      "id": "miffyliye",
      "name": "MiffyLiye",
      "dob": "2012-12-31",
      "address": "China",
      "description": "DEV",
      "updatedAt": "2020-03-18T09:44:52.780Z",
      "createdAt": "2020-03-18T09:44:52.780Z"
    }
```

If the request failed, the response will contain the error message
```
Status
  - 400 Bad Request
Body
  - {
      "statusCode": 400,
      "message": "User already exists.",
      "error": "Bad Request"
    }
```

Results

| Name | Description |
| -- | -- |
| message | error message |

### Get User by ID

#### 1. Generate Auth Headers using [HMAC Auth Strategy](./authentication.md).

#### 2. Send HTTP request

```
GET /users/miffyliye
Headers
  - HMAC Auth Headers
```

Parameters

| Name | Place | Required | Description |
| -- | -- | -- | --|
| id | uri path | true | user id, the "miffyliye" in the example |

##### Response

If the user exists, the response will be
```
Status
  - 200 OK
Body
  - {
      "id": "miffyliye",
      "name": "MiffyLiye",
      "dob": "2012-12-31",
      "address": "China",
      "description": "DEV",
      "updatedAt": "2020-03-18T09:44:52.780Z",
      "createdAt": "2020-03-18T09:44:52.780Z"
    }
```

Results

| Name | Description |
| -- | -- |
| id | user id, it consists of alphabets and digits |
| name | user name |
| dob | date of birth, it should be in YYYY-MM-DD format |
| address | user address |
| description | user description |
| createdAt | user created date |
| updatedAt | user updated date |

If the request failed, the response will contain the error message
```
Status
  - 404 Not Found
Body
  - {
      "statusCode": 404,
      "message": "User does not exist",
      "error": "Not Found"
    }
```

Results

| Name | Description |
| -- | -- |
| message | error message |

### Update User

#### 1. Generate Auth Headers using [HMAC Auth Strategy](./authentication.md).

#### 2. Send HTTP request

```
PUT /users/miffyliye
Headers
  - HMAC Auth Headers
Body
  - {
      "name": "MiffyLiye",
      "dob": "2012-12-31",
      "address": "China",
      "description": "ARCH"
    }
```

Parameters

| Name | Required | Description |
| -- | -- | --|
| id | true | user id, in the uri path, the "miffyliye" in the example |
| name | false | user name |
| dob | false | date of birth, it should be in YYYY-MM-DD format |
| address | false | user address |
| description | false | user description |

##### Response

If the user is updated, the response will be
```
Status
  - 200 OK
Body
  - {
      "id": "miffyliye",
      "name": "MiffyLiye",
      "dob": "2012-12-31",
      "address": "China",
      "description": "ARCH",
      "updatedAt": "2020-03-18T13:37:02.281Z",
      "createdAt": "2020-03-18T13:29:31.520Z"
    }
```

If the request failed, the response will contain the error message

For example if the request body is
```
{
  "dob": "123456"
}
```
The response will be
```
Status
  - 400 Bad Request
Body
  - {
      "statusCode": 400,
      "message": "User validation failed: dob: 12345 is not a valid date!",
      "error": "Bad Request"
    }
```

If the user does not exist, the response will be
```
Status
  - 404 Not Found
Body
  - {
      "statusCode": 404,
      "message": "User does not exist",
      "error": "Not Found"
    }
```


Results

| Name | Description |
| -- | -- |
| message | error message |

### Delete User

#### 1. Generate Auth Headers using [HMAC Auth Strategy](./authentication.md).

#### 2. Send HTTP request

```
DELETE /users/miffyliye
Headers
  - HMAC Auth Headers
```

Parameters

| Name | Required | Description |
| -- | -- | --|
| id | true | user id, in the uri path, the "miffyliye" in the example |

##### Response

If the user is deleted, or the user does not exist, the response will be
```
Status
  - 200 OK
```

### List Users

#### 1. Generate Auth Headers using [HMAC Auth Strategy](./authentication.md).

#### 2. Send HTTP request

```
GET /users?offset=1&limit=2
Headers
  - HMAC Auth Headers
```

Parameters

| Name | Place | Required | Description |
| -- | -- | -- | --|
| offset | query | false | default value is 0 |
| limit | query | false | default value is 10 |

The users are ordered by id.

##### Response

The response will be
```
Status
  - 200 OK
Body
  - {
      "meta": {
          "offset": 1,
          "limit": 2
      },
      "data": [
          {
            "id": "miffyliye",
            "name": "MiffyLiye",
            "dob": "2012-12-31",
            "address": "China",
            "description": "DEV",
            "updatedAt": "2020-03-18T09:44:52.780Z",
            "createdAt": "2020-03-18T09:44:52.780Z"
          },
          {
            "id": "wangtao",
            "name": "Wang Tao",
            "dob": "2012-12-31",
            "address": "China",
            "description": "DEV",
            "updatedAt": "2020-03-18T13:27:12.129Z",
            "createdAt": "2020-03-18T13:27:12.129Z"
          }
      ]
    }
```
Results

| Name | Place | Description |
| -- | -- | --|
| meta.offset | body | offset used when list users |
| meta.limit | body | limit used when list users |
| data | body | a list of users |

