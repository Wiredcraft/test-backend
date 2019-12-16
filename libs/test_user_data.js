let ObjectID = require('mongodb').ObjectID;

let data = [ { "_id" : ObjectID("5df24fe5a151d95809659a2e"),
             "name" : "Commander Data",
             "dob" : "1970-01-10T09:03:36.104Z", 
             "address" : "USS Enterprise", 
             "position": {coordinates: [121.5874, 31.3481]},
             "description" : "First Android in Starfleet"}]

module.exports = data;
