# Wiredcraft Back-end Developer Test

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

```
http://localhost:3000/apidoc/
```
