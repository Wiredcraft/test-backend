---
id: Authentication
title: Authentication
sidebar_label: Authentication
---

Test Backend API uses [JWT(JSON Web Token)](https://jwt.io/) for basic authentication.

Example token content:

```json
{
  "name": "exampleUser",
  "expiration": 1593191335454
}
```

| Field        | Type     | Description                                          |
| ------------ | -------- | ---------------------------------------------------- |
| `Name`       | `string` | Username, used for authentication and authorization. |
| `Expiration` | `number` | Token expiration time in ms with epoch format        |

### /Register

`POST`

| Parameters | Type     | Description                                                                                    |
| ---------- | -------- | ---------------------------------------------------------------------------------------------- |
| `username` | `string` | Username, used for authentication and authorization.                                           |
| `password` | `string` | User password in plain text, will be salted and encrypted with bycrypt and stored in database. |

Example Request

```json
{
  "username": "admin",
  "password": "123456"
}
```

Example Response

```json
{
  "message": "register successful"
}
```

### /Login

`POST`

| Parameters | Type     | Description                                          |
| ---------- | -------- | ---------------------------------------------------- |
| `username` | `string` | Username, used for authentication and authorization. |
| `password` | `string` | User password in plain text.                         |

Example Request

```json
{
  "username": "admin",
  "password": "123456"
}
```

Example Response

```json
{
  "message": "login successful"
}
```

### /logout

`GET`

Example Response

```json
{
  "message": "logout successful"
}
```
