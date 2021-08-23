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
const DB_URL = 'mongodb://haohaop:19960718@localhost:27017/dataDb?authSource=admin';
```
### Running tests
```
npm start
```
### API Doc
```
http://localhost:3000/apidoc/
```
