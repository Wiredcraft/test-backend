const path = require("path")
const thirdServicesEnvConfigController = require(path.join(__dirname,"../config/index.js"));
const { MongoClient } = require("mongodb");


async function connect (currentClient) {
  const thirdServicesEnvConfig = thirdServicesEnvConfigController.instance["env"]
  let mongodbUrl = `mongodb://${thirdServicesEnvConfig.mongodbUser}:${thirdServicesEnvConfig.mongodbPassword}@${thirdServicesEnvConfig.mongodbHost}:${thirdServicesEnvConfig.mongodbPort}`;
  currentClient.instance = await new Promise((resolve, reject)=>{
    MongoClient.connect(mongodbUrl,(err,client)=>{
      if(err) {
        reject(err.message)
      } else {
        resolve(client)
      }
    });
  });
}

module.exports = {
  instance : "",
  init : async function() {
    await connect(this);
  }
};
