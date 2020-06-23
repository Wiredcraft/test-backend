---
id: Models
title: Models
sidebar_label: Models
---

Test Backend uses mongoose model schemas.

### Automatic REST API creation

To create a new model, simply add mongoose model schema at `models` folder and the rest API Builder will automatically scan and discover the model. Then build a REST API based on model information.

:::info
Model path can be changed in `util/consts.ts`
:::

### API Reference

A typical model will have following APIs

### /resource

`GET` /resource

Fetch all resources and return them in an array

Example response

`200`

```json
[
  {
    "property1": "value1",
    "property2": "value2",
  },
  {
    "property1": "value1",
    "property2": "value2",
  },
  {
    "property1": "value1",
    "property2": "value2",
  }
]
```

`POST` /resource

Create a new resource instance

Example request:

```json
{
  "property1": "value1",
  "property2": "value2",
}
```

Example response:

`201`

```json
{
  "Location": "/resource/5ef25142cee24c457d842f1d"
}
```

`PUT` /resource

:::caution

This is not the API to use if you want replace a single resource, use `/resouce/:id` for that purpose

:::

Replace all resources of this type with new resources in request array

Example request:

```json
[
  {
    "property1": "value1",
    "property2": "value2",
  }
]
```

Example response:

`204` 

`PATCH` /resource

Not supported due to REST API standard

Example response:

`405`

`DELETE` /resource

Delete all resources of this kind

Example response:

`204`

### /resource/:id

`GET` /resource/:id

Find and fetch a particular resource by id

Example Response:

`200`

```json
{
  "property1": "value1",
  "property2": "value2",
}
```

`PUT` /resource/:id

Replace  a specific resource with the one in request body

Example Request

```json
{
  "property1": "value1",
  "property2": "value2",
}
```

Example response:

`204`

`PATCH` /resource/:id

Modify a specific resource

```json
{
  "property1": "ChangedValue",
}
```

Example response:

`204`

`DELETE` /resource/:id

Delete a specific resource

Example response:

`204`





### Custom API

Sometimes the automatically built API is not enough for business logic. Custom API can then be added in `custom`  API builders. Allowing for maxium customization.