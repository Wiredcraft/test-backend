import { Schema } from "mongoose"
import { mongoClient } from '../db'
import moment = require('moment')

const userSchema = new Schema({
  name: {
    type: String,
  },
  dob: {
    type: Date,
    set: (v: string) => new Date(moment(v).format('YYYY-MM-DD'))
  },
  age: {
    type: Number,
  },
  address: {
    type: String,
    // coordinates: [Number]
  },
  description: {
    type: String,
  },
  following: [{ type: Schema.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.ObjectId, ref: 'User' }],
  salt: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  }
},
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

const User = mongoClient.model(`User`, userSchema, 'users')

export { User, userSchema }
