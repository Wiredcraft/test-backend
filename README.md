# Wiredcraft Back-end Developer Test

Make sure you read **all** of this document carefully, and follow the guidelines in it.

## Context

Build a RESTful API that can `get/create/update/delete` user data from a persistence database

### User Model

```
{
  "id": "xxx",                  // user ID (you can use uuid or the ID provided by database, but need to be unique)
  "name": "test",               // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "createdAt": ""               // user created date
}
```

## Requirements

### Functionality

- The API should follow typical RESTful API design pattern.
- The data should be saved in the DB.
- Provide proper API document.

### Tech stack

- Use Node.js and any framework.
- Use any DB. NoSQL DB is preferred.

### Bonus

- Write clear **documentation** on how it's designed and how to run the code.
- Provide proper unit test.
- Write good commit messages.
- An online demo is always welcome.

### Advanced requirements

These are used for some further challenges. You can safely skip them if you are not asked to do any, but feel free to try out.

- Use [Seneca](http://senecajs.org/) to build the core feature and use a different framework (such as Express or Loopback) to handle HTTP requests.
- Provide a complete user auth (authentication/authorization/etc) strategy, such as OAuth.
- Provide a complete logging (when/how/etc) strategy.
- Use a NoSQL DB and build a filter feature that can filter records with some of the attributes such as username. Do not use query languages such as MongoDB Query or Couchbase N1QL.

## What We Care About

Feel free to use any libraries you would use if this were a real production App, but remember we're interested in your code & the way you solve the problem, not how well you can use a particular library.

We're interested in your method and how you approach the problem just as much as we're interested in the end result.

Here's what you should aim for:

- Good use of current Node.js & API design best practices.
- Solid testing approach.
- Extensible code.

## Q&A

> Where should I send back the result when I'm done?

Fork this repo and send us a pull request when you think you are done. We don't have a deadline for the task.

> What if I have a question?

Create a new issue in the repo and we will get back to you very quickly.
