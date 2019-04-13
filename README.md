# Wiredcraft Back-end Developer Test

Make sure you read **all** of this document carefully, and follow the guidelines in it.

## Answer
You can found my answer document from the [Strategy summary](Strategy.md)

## Context

Build a RESTful API that can `get/create/update/delete` user data from a persistence database

### User Model

```
{
  "id": "xxx",                  // user ID
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
- Provide proper unit test.
- Provide proper API document.

### Tech stack

- Use Node.js and any framework.
- Use any DB. NoSQL DB is preferred.

### Bonus

- Write clear **documentation** on how it's designed and how to run the code.
- Write good in-code comments.
- Write good commit messages.
- An online demo is always welcome.

### Advanced requirements

*These are used for some further challenges. You can safely skip them if you are not asked to do any, but feel free to try out.*

- Imagine we have a new requirement now, that the user instances need to link to each other, for example, a list of "followers/following" or "friends". Can you find out how you would design the model structure and what API you would build for querying or modifying it?
- Provide a complete user auth (authentication/authorization/etc) strategy, such as OAuth.
- Provide a complete logging (when/how/etc) strategy.

## What We Care About

Feel free to use any open-source library if you see a good fit, but also remember that we're more interested in finding out your code skill and problem solving skill.

Here's what you should aim for:

- Good use of current Node.js & API design best practices.
- Solid testing approach.
- Extensible code.

## Q&A

> Where should I send back the result when I'm done?

Fork this repo and send us a pull request when you think it's ready for review. You don't have to finish everything prior and you can continue work on it. We don't have a deadline for the task.

> What if I have a question?

Create a new issue in the repo and we will get back to you quickly.
