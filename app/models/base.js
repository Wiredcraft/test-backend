const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const mongoosePaginate = require('mongoose-paginate')

const connection = require('../db')

const generateModel = (name, schema, indexList) => {
  const modelSchema = new mongoose.Schema(schema)

  modelSchema.plugin(timestamps)
  modelSchema.plugin(mongoosePaginate)

  modelSchema.methods.toData = function () {
    // delete unused fields
    const obj = this.toObject()
    obj.id = obj._id
    delete obj._id
    delete obj.__v
    delete obj.updatedAt
    return obj
  }

  if (indexList) {
    for (const index of indexList) {
      modelSchema.index(...index)
    }
  }

  modelSchema.statics.upsert = function (where, data) {
    return this.findOneAndUpdate(where, data, {
      upsert: true,
      new: true
    })
  }

  modelSchema.statics.updateById = function (id, data) {
    return this.findOneAndUpdate({ _id: id }, data, {
      new: true
    })
  }

  const model = connection.model(name, modelSchema)
  return model
}

module.exports = generateModel
