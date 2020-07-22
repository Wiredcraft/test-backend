const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const connection = require('../db')

const generateModel = (name, schema, indexList) => {
  const modelSchema = new mongoose.Schema(schema)

  modelSchema.plugin(timestamps)

  if (indexList) {
    for (const index of indexList) {
      modelSchema.index(...index)
    }
  }

  modelSchema.statics.upsert = async function (where, data) {
    return await this.findOneAndUpdate(where, data, {
      upsert: true,
      new: true
    })
  }

  modelSchema.statics.updateById = async function (id, data) {
    return await this.findOneAndUpdate(id, data, {
      new: true
    })
  }

  const model = connection.model(name, modelSchema)
  return model
}

module.exports = generateModel
