const
  _ = require('lodash'),
  mongoose = require('mongoose'),
  userModel = mongoose.model('user');

const count = async (params) => {
  let query = _.pick(params, ['_id', 'location'])
  let count = await userModel.count(query);
  return count;
};

const findAll = async (params) => {
  let query = _.pick(params, ['_id', 'skip', 'limit', 'sort']);
  let data = await userModel.find({}, {}, {limit: query.limit, skip: query.skip});
  return data;
};

const create = async (params) => {
  let query = _.pick(params, ['name', 'dob', 'address', 'description', 'location', 'createdAt']);
  let data = await userModel.create(query);
  return data;
};

const findOneAndUpdate = async (params) => {
  cond = _.pick(params, ['_id']);
  update = _.pick(params, ['name', 'dob', 'address', 'description', 'location', 'createdAt']);
  opt = { new: true, upsert: true }
  let data = await userModel.findOneAndUpdate(cond, update, opt);
  return data;
};

const findByIdAndDelete = async (_id) => {
  return await userModel.findByIdAndDelete(_id);
};

const findById = async (_id) => {
  return await userModel.findById(_id);
};

const getNearbyUsers = async (params) => {
  let result =  await userModel.aggregate([
    {
      $geoNear: { 
        near: params.near,
        spherical: true,
        distanceMultiplier: 6378137,
        maxDistance: params.max / 6378137,
        distanceField: "distance"
      }
    }
  ]);
  return result;
};

module.exports = {
  count,
  findAll,
  create,
  findOneAndUpdate,
  findByIdAndDelete,
  findById,
  getNearbyUsers
};
  