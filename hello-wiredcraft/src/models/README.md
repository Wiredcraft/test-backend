# Models

## User

| Field       | Type    | Required  |  Nullable | Default Value |Remark |
| :----       | :----   | :----:    | :----:    | :----:        | :---- |
| id          | string  | Y         | N         |  UUID         |User ID |
| name        | string  | Y         | N         |  -            |User name |
| dob         | date    | N         | Y         |  -            |Date of birth |
| address     | string  | N         | Y         |  -            |User address |
| description | string  | N         | Y         |  -            |User description |
| createdAt   | date    | N         | N         |  Date.now()   |User created date |
| deleted     | boolean | N         | N         |  false        |User created date |
