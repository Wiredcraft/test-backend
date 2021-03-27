## Mongo implementation for Infrastructure Tier

In this tier we use [mongoose libary](https://mongoosejs.com/) to persist data.
See the README.md in the project root directory to grasp how to launch the Mongo server in local.

We map Mongo's [`_id` property](https://docs.mongodb.com/manual/reference/bson-types/#objectid) to the `id` property of `User` entity.
