---
id: Access
title: Access
sidebar_label: Access
---

Access is a built-in type, it stores a following object:

```js
{
  everyone: 0,
  user: 1,
  operator: 1,
  self: 2
}
```

### AccessType

```js
enum AccessType {
  noAccess = 0,
  readOnly = 1,
  fullAccess = 2,
}
```

### Access Schema

```js
{
    everyone: {
      required: true,
      type: String,
      enum: Object.values(AccessType),
    },
    user: {
      required: true,
      type: String,
      enum: Object.values(AccessType),
    },
    operator: {
      required: true,
      type: String,
      enum: Object.values(AccessType),
    },
    self: {
      required: true,
      type: String,
      enum: Object.values(AccessType),
    }
  }
```

### Pre-defined Access

Here are a list of predefined access that can come in handy when assigning access to resource

| Access Name     | Value                                                                 |
| --------------- | --------------------------------------------------------------------- |
| public          | Everyone can read, operator and owner have full access                |
| userOnly        | Only authenticated user can read, operator and owner have full access |
| operatorOnly    | Operator and owner have full access                                   |
| operatorLimited | Operator can read and only owner have full access                     |
| personal        | Only owner have full access                                           |
| adminOnly       | Only admin have full access                                           |

:::note

Only `admin` can create new accesses.

:::
