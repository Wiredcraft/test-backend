# Getting Started

Note: Only the basic instruction are covered here, refer to inner documentation for more information

#### Requirements

You need [mongodb](https://www.mongodb.com/download-center/community) & [nodejs](https://nodejs.org/en/download/) installed to run this application

Before you run, install the dependencies using:

```bash
yarn
```

Add a `.env` file with content like:

```env
PORT=7777
SECRET='SOME_RANDOM_STRING'
JWT_EXPIRATION_MS=259200000
MONGODB_CONNECT_STRING='mongodb://127.0.0.1:27017/test-backend'
```

#### Start the application

```bash
yarn start
```

#### Debug

```bash
yarn debug
```

#### Test

```bash
yarn test
```

#### Serve documentation

Before you run, install the dependencies using:

```bash
yarn
```

Then:

```bash
cd docs && yarn start
```

use search in documentation

```bash
cd docs && yarn build
npx http-server docs/build
```

# Wiredcraft Back-end Developer Test

Make sure you read the whole document carefully and follow the guidelines in it.

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

- [x] The API should follow typical RESTful API design pattern.
- [x] The data should be saved in the DB.
- [x] Provide proper unit test.
- [x] Provide proper API document.

### Tech stack

- [x] Use Node.js and any framework.
- [x] Use any DB. NoSQL DB is preferred.

### Bonus

- [x] Write clear documentation on how it's designed and how to run the code.
- [ ] Write good in-code comments.
- [ ] Write good commit messages.
- [ ] An online demo is always welcome.

### Advanced requirements

_These are used for some further challenges. You can safely skip them if you are not asked to do any, but feel free to try out._

- [x] Provide a complete user auth (authentication/authorization/etc.) strategy, such as OAuth.
- [x] Provide a complete logging (when/how/etc.) strategy.
- [ ] Imagine we have a new requirement right now that the user instances need to link to each other, i.e., a list of "followers/following" or "friends". Can you find out how you would design the model structure and what API you would build for querying or modifying it?
- [x] Related to the requirement above, suppose the address of user now includes a geographic coordinate(i.e., latitude and longitude), can you build an API that,
  - given a user name
  - return the nearby friends

## What We Care About

Feel free to use any open-source library as you see fit, but remember that we are evaluating your coding skills and problem solving skills.

Here's what you should aim for:

- [ ] Good use of current Node.js & API design best practices.
- [ ] Good testing approach.
- [ ] Extensible code.

## FAQ

> Where should I send back the result when I'm done?

Fork this repo and send us a pull request when you think it's ready for review. You don't have to finish everything prior and you can continue to work on it. We don't have a deadline for the task.

> What if I have a question?

Create a new issue in the repo and we will get back to you shortly.
