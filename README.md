# Wiredcraft Back-end Developer Coding Test (realtime version)

Make sure you read **all** of this document carefully, and follow the guidelines in it.

## Overview

This task is has the following requirements:
- Build a restful api that could `get/create/update/delete` user data from a database.
- Build functionality to __communicate data changes to data in realtime__ to web client. You can assume all data modifications go through the API.
- Build simple frontend that demonstrates the backend works (does not need to be pretty).

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
GET    /user/{id}                   - Get user by ID
POST   /user/                       - To create a new user
PUT    /user/{id}                   - To update an existing user with data
DELETE /user/{id}                   - To delete a user from database
```

## Getting started

There's nothing here, we leave it to you to choose the build tool, code structure, framework, testing approach...

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
