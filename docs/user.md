# User

default response data format: `json`
default params format of GET/DELETE requests: ```?${params1}=${value1}&${params2}=${values2}```
default params format of other requests: json in body

## GET /users

* get user info

### Parameters

|Name   |Type   |Optional   |In	Description |
|-------|-------|-----------|---------------|
|id     |numbser|t          |user id        |
|name   |string |t          |user name      |

### Response

|Name       |Type   |Optional   |In	Description |
|-----------|-------|-----------|---------------|
|id         |numbser|f          |user id        |
|name       |string |f          |user name      |
|address    |string |t          |user address   |
|created_at |Date   |t          |user created at|
|dob        |Date   |t          |user birthday  |
|description|string |t          |description    |

## POST /users

* create a new user(login required)

### Parameters

|Name       |Type   |Optional   |In	Description |
|-----------|-------|-----------|---------------|
|name       |string |f          |user name      |
|address    |string |t          |user address   |
|created_at |Date   |t          |user created at|
|dob        |Date   |t          |user birthday  |
|description|string |t          |description    |

### Response

|Name       |Type   |Optional   |In	Description |
------------|-------|-----------|---------------|
|id         |numbser|f          |user id        |
|name       |string |f          |user name      |
|address    |string |t          |user address   |
|created_at |Date   |t          |user created at|
|dob        |Date   |t          |user birthday  |
|description|string |t          |description    |

## PUT /users

* update user info(login required)

### Parameters(in params)

|Name       |Type   |Optional   |In	Description |
|-----------|-------|-----------|---------------|
|id         |number |f          |user id        |

### Parameters(in body)

|Name       |Type   |Optional   |In	Description |
|-----------|-------|-----------|---------------|
|name       |string |t          |user name      |
|address    |string |t          |user address   |
|created_at |Date   |t          |user created at|
|dob        |Date   |t          |user birthday  |
|description|string |t          |description    |

### Response

|Name       |Type   |Optional   |In	Description |
|-----------|-------|-----------|---------------|
|id         |numbser|f          |user id        |
|name       |string |f          |user name      |
|address    |string |t          |user address   |
|created_at |Date   |t          |user created at|
|dob        |Date   |t          |user birthday  |
|description|string |t          |description    |

## DELETE /users

* delete a user(login required)

### Parameters

|Name       |Type   |Optional   |In	Description |
|-----------|-------|-----------|---------------|
|id         |number |f          |user id        |

### Response

|Name       |Type   |Optional   |In	Description |
|-----------|-------|-----------|---------------|
