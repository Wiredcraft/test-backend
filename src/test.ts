var { MongoClient, ObjectId } = require('mongodb');
var url = 'mongodb://localhost:27017/test-backend';

MongoClient.connect(url, function (err: any, db: any) {
  if (err) throw err;
  console.log('Database created!');

  const dbo = db.db('test-backend');
  dbo
    .collection('user')
    .findOne(
      { _id: ObjectId('62b2c1a1bb6ba259276b7c4f') },
      function (err: any, result: any) {
        if (err) throw err;
        console.log(result);
        db.close();
      }
    );
});
