---
id: Introduction
title: Introduction
sidebar_label: Introduction
---

Welcome to [Test Backend](./Introduction.md) API documentation. This API is organized around [REST](http://en.wikipedia.org/wiki/Representational_State_Transfer). It has predictable resource-oriented URLs, accepts [JSON-encoded](http://www.json.org/) request bodies, returns [JSON-encoded](http://www.json.org/) responses, and uses standard HTTP response codes, authentication, and verbs.

### Prerequisites

The API is based on `Node.js` and `MongoDB`. If you don't already have them installed, you can download and install them with link below, for more information on how to setup the environment, please go to [Environment Setup](./Environment.md)

Install latest `Node.js` from [here](https://nodejs.org/en/download/)

Install latest `MongoDB` from [here](https://www.mongodb.com/download-center/community)

### Getting Started

##### Install dependencies

```bash
yarn
```

##### Setting up `dotenv`

Add a `.env` file with content like:

```env
PORT=7777
SECRET='SOME_RANDOM_STRING'
JWT_EXPIRATION_MS=259200000
MONGODB_CONNECT_STRING='mongodb://127.0.0.1:27017/test-backend'
```

##### Start the application

```bash
yarn start
```

##### Debug

```bash
yarn debug
```

##### Test

```bash
yarn test
```
