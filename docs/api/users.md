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
| id | true | user name, it consists of alphabets and digits |
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
      "id": "miffyliye"
    }
```

Results

| Name | Description |
| -- | -- |
| id | user name |

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
| id | user name, it consists of alphabets and digits |
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
