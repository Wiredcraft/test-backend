const prepare = require("mocha-prepare");
const { MongoMemoryServer } = require( 'mongodb-memory-server');
const mongoSvc = require('../src/service/mongo-service');

process.env.MONGODB_COLLECTION_NAME_USER='User';

let mongod;

// prepare test env
// start a memory mongo DB for unit tests
prepare(async function (done) {
    console.info("Starting memory mongo DB.....")
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGODB_URL = uri;
    mongoSvc.initMongoConnection(uri);
    done();
},function (done) {
    mongod.stop();
    console.info("Stopping memory mongo DB......");
    done();
})
