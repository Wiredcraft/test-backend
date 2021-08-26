# Wiredcraft Back-end Developer Test

The project was built using the Express framework. And uses mongoDB database and uses mongoose to connect it.

### Module used
- Log: morgan
- Database framework: mongoose
- Field validation: express-validator
- Unit test: chai + mocha + nyc
- API Doc: API Doc

### File structure

```
|-- test-backend
    |-- .git_template       // commit template
    |-- .eslintignore       // eslint ignore
    |-- .eslintrc.js        // eslint config
    |-- .gitignore          // git ignore
    |-- apidoc.json         // APIDoc config
    |-- app.js
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- controllers         // controllers
    |   |-- user.js
    |-- database            // databae
    |   |-- db.js
    |   |-- models          // database models
    |       |-- counter.js
    |       |-- user.js
    |-- models              // models
    |   |-- result.js
    |-- public
    |-- routes              // routes
    |   |-- user.js
    |-- test                // unit test
    |   |-- app.spec.js
    |-- utils               // utils
        |-- constant.js
```

## Demo

Test demo on the website [Test](http://www.haohaop.com) and [API Doc](http://www.haohaop.com/apidoc).

### Server description

The service is deployed on Aliyun's serverless application center.Use Aliyun's Log Service to manage logs.

### Front-end project URL

https://github.com/HaoHaoP/haohaop-frontend

## How to get started

### Create MongoDB database

```
use dataDb
db.counter.insertOne({_id: 'userid', sequence_value: 1});
db.user.insertOne({
  _id: 1,
  name: 'Admin',
  dob: new Date(),
  address: '',
  description: '',
  createdAt: new Date(),
});
```

### Edit DB_URL in database/db.js

```javascript
const DB_USER = 'haohaop';
const PASSWORD = encodeURIComponent('19960718');
const DB_URL = `mongodb://${DB_USER}:${PASSWORD}@localhost:27017/dataDb?authSource=admin`;
```

### Running demo

```
npm install
npm start
```

### API Doc

http://localhost:3000/apidoc/
