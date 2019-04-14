[![CircleCI](https://circleci.com/gh/lerignoux/wiredcraft-test-backend/tree/master.svg?style=svg)](https://circleci.com/gh/lerignoux/wiredcraft-test-backend/tree/master) [![Known Vulnerabilities](https://snyk.io/test/github/lerignoux/wiredcraft-test-backend/badge.svg?targetFile=api%2Fpackage.json)](https://snyk.io/test/github/lerignoux/wiredcraft-test-backend?targetFile=api%2Fpackage.json)

# Wiredcraft Back-end Developer Test

Make sure you read **all** of this document carefully, and follow the guidelines in it.

## Answer
You can found my answer document from the [Strategy summary](Strategy.md)

## tldr
```
docker-compose up -d
```

## Setup
ensure you have docker and docker-compose installed.
fetch the repository
update the nginx configuration with your certificates
```
docker-compose up -d
```
the api is accessible at `https://<server_name>:1443/api`

## Dev Setup
To setup the dev environement (*no ssl*) you can use the development docker-compose:
```
docker-compose -f docker-compose-dev.yml up -d
```

the api is then accessible at [http://localhost:1080/api](http://localhost:1080/api)

### Documentation:
The swagger documentation is available on the api:
```
http://localhost:1080/api/api-docs/
```
adapt the host on production

### Test run
In order to run the test suite:
```
docker run -it --rm --name wiredcraft-test-backend-tests -v <your_path>/wiredcraft-test-backend/api:/app wiredcraft-api npm run test
```

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
