# Wiredcraft Back-end Developer Coding Test


## Background

Build a restful api that could `get/create/update/delete` user data from a persistence database

### User Model

```
{
  "id": "xxx",                  // user id(you can use uuid or the id provided by database, but need to be unique)
  "name": "test",               // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "created_at": ""              // user created date
}
```

### API

```
GET    /users/{id}                   - Get user by ID
POST   /users/                       - To create a new user
PUT    /users/{id}                   - To update an existing user with data
DELETE /users/{id}                   - To delete a user from database
```

## Getting started

I choose MongoDB for persisting data, so before you running this application, please configure your MongoDB settings through `server/datasources.json`.

## Requirements

- With clear documentation on how to run the code and api usage

- Proper use of RESTFUL api design pattern

- Provide proper unit test

- Choose either sql or no-sql database to make the data persistence

- Use git to manage code


## What We Care About

Feel free to use any libraries you would use if this were a real production app, but remember we're interested in your code & the way you solve the problem, not how well you can use a particular library.

We're interested in your method and how you approach the problem just as much as we're interested in the end result.

Here's what you should aim for:

- Good use of current restful api design & performance best practices.

- Solid testing approach

- Extensible code;

## Q&A

* Where should I send back the result when I'm done?

Fork this repo and send us a pull request when you think you are done. We don't have deadline for the task.

* What if I have question?

Create a new issue in the repo and we will get back to you very quickly.
