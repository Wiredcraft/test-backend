const mongodbController = require("../mongodb/common");
const commonController = require("../utils/common")


const crudControllers = {
  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Promise<void>}
   */
  async getUser (req, res, next) {
    const filter = req.query;
    const wiredCraftUsers = await mongodbController.getMongodbDbAndCollection("qianWu","user");
    const result = await wiredCraftUsers.findOne(filter);
    if (commonController.isNullObject(result)) {
      res.send({"message" : "no this name"})
    } else {
      res.send(result);
    }
  },

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Promise<void>}
   */
  async createUser (req, res, next) {
    // {
    //    "id": "xxx", // user ID
    //      "name": "test", // user name
    //      "dob": "", // date of birth
    //      "address": "", // user address
    //      "description": "", // user description
    //      "createdAt": "" // user created date
    //   }
    const newUser = req.body;
    newUser.createdAt = new Date().getTime();
    const wiredCraftUsers = await mongodbController.getMongodbDbAndCollection("qianWu","user");
    await wiredCraftUsers.insertOne(newUser);
    res.send({"message":"Insert successfully"});
  },

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Promise<void>}
   */
  async updateUser (req, res, next) {
    // {
    //    "id": "xxx", // user ID
    //      "name": "test", // user name
    //      "dob": "", // date of birth
    //      "address": "", // user address
    //      "description": "", // user description
    //      "createdAt": "" // user created date
    //   }
    const user = req.body;
    const wiredCraftUsers = await mongodbController.getMongodbDbAndCollection("qianWu","user");
    await wiredCraftUsers.updateOne({"name" : user.name},{$set : user});
    res.send({"message":"Update successfully"});
  },
  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Promise<void>}
   */
  async deleteUser (req, res, next) {
    // {
    //    "id": "xxx", // user ID
    //      "name": "test", // user name
    //      "dob": "", // date of birth
    //      "address": "", // user address
    //      "description": "", // user description
    //      "createdAt": "" // user created date
    //   }
    const user = req.body;
    const wiredCraftUsers = await mongodbController.getMongodbDbAndCollection("qianWu","user");
    await wiredCraftUsers.removeOne({"name" : user.name});
    res.send({"message":"Delete successfully"});
  }

}
module.exports = crudControllers;
