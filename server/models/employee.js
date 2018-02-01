const mongoose = require('mongoose')

// Define the employee schema
const Schema = mongoose.Schema
const EmployeeSchema = new Schema({
  name:        { type: String, default: '', trim: true, required: true },
  username:    { type: String, default: '', required: true, unique: true },
  dob:         { type: String, default: '', required: true },
  address:     { type: String, default: '', required: true },
  description: { type: String, default: '', required: true },
  createdAt:   { type: Date, default: Date.now },
  createdBy:   { type: String, default: ''}
})

/* Regisrer the model and export it */
module.exports = mongoose.model('Employee', EmployeeSchema)
