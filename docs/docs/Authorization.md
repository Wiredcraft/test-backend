---
id: Authorization
title: Authorization
sidebar_label: Authorization
---

Test Backend uses role base authorization with customizable access types. Took inspiration from linux file system access control.

:::info

The First registered user will automatically become administrator.

:::

### Roles

There are only 3 roles in the system, each user can only have one role.

| Role     | Description                                                  |
| -------- | ------------------------------------------------------------ |
| admin    | System administrator, the first registered user will automatically become administrator. |
| operator | System operators, have a special access group, generally have more access than regular users. |
| user     | Basic user role                                              |



### AccessGroup

Users are broken into 4 groups: `everyone`, `user`, `opreator`, `self`.

Each represents a group of users.

Note that `Administrator` is not listed here, because `Administrator`

| AccessGroup | Description                                          |
| ----------- | ---------------------------------------------------- |
| Everyone    | Everyone using the system, including general public. |
| User        | Authenticated users of the system.                   |
| operator    | Operators, admin not included.                       |
| Self        | The owner of the resource.                           |



### AccessTypes

Represent the type of operations a user can operate on certain type of resource

| AccessType     | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| noAccess = 0   | Cannot do anything to the resource                           |
| readOnly = 1   | Can only operate `GET` operation on the resource             |
| fullAccess = 2 | Can perform all `GET`, `POST`, `PUT`, `DELETE` rest methods on the resource |

Note this enum have a numeric value, and they have a natural comparison relationships, in short: `fullAccess > readOnly >  noAccess`

### Resource Access

:::info

Resource without access field will be defaults to `AdminOnly` predefined access.

:::

The resource will have access field containing object like below:

```js
{
    everyone: 0,
    user: 1,
    operator: 2,
    self: 2,
}
```

Resource can also have an optional `owner` field, which will be used access checking for `self` in `AccessGroup`.

### Pre-defined Access

Here are a list of predefined access that can come in handy when assigning access to resource

| Access Name     | Value                                                        |
| --------------- | ------------------------------------------------------------ |
| public          | Everyone can read, operator and owner have full access       |
| userOnly        | Only authenticated user can read, operator and owner have full access |
| operatorOnly    | Operator and owner have full access                          |
| operatorLimited | Operator can read and only owner have full access            |
| personal        | Only owner have full access                                  |
| adminOnly       | Only admin have full access                                  |

### Customized Access

Administrator can create/modify access type using `/access` rest API, allowing maxium customization of the system.

