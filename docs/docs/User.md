---
id: User
title: User
sidebar_label: User
---

### User Schema

```js
  {
    name: {
      unique: true,
      index: true,
      type: String,
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    followers: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    role: {
      required: true,
      type: String,
      enum: Object.values(Roles),
    },
    access: {
      type: Schema.Types.Mixed,
    },
    hashedPassword: {
      required: true,
      type: String,
    },
    lastLogin: {
      type: Date,
    },
  },
```

:::note

Only `admin` can create other users. 

:::

:::info

When registering, only essential fields will be filled(username, password, role). Other fields have to be manually added using REST API. Excessive information during register will be discarded.

:::

### User Specific APIs

### /user/nearby/:username/:quantity

`GET`

| Field      | Type     | Description                                 |
| ---------- | -------- | ------------------------------------------- |
| `username` | `string` | Username, target user to find nearby users. |
| `quantity` | `number` | Amount of users to find, defaults to `10`.  |


Find nearby users with give user name

Example Response:

`200`

```json
[
  "nearbyUser1",  "nearbyUser2",  "nearbyUser3",
]
```

