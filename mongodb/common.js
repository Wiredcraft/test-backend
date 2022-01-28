const mongodbController = require("../mongodb/index")

/**
 * @param {String} dbName
 * @param {String} collectionName
 * @returns {Promise<void>}
 */
async function getMongodbDbAndCollection (dbName, collectionName) {
  return await mongodbController.instance.db(dbName).collection(collectionName)
}

module.exports = {
  getMongodbDbAndCollection,
  apiConnector(handler){
    return async function (req,res,next) {
      try {
        await handler(req,res,next)
      }catch(error){
        res.send({
          status: 51001,
          data: error
        })
      }
    }
  }
};
