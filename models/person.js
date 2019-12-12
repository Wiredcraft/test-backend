let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectID = require('mongodb').ObjectID;

const PersonSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  dob: {
    type: Date,
    required: true,
    index: true
  },
  address: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Use a compound index to prevent duplicate person
 **/
PersonSchema.index({name: 1, dob: 1, address: 1}, {unique: true});

/**
 * Return person objects with an id field
 * Convert Mongo generated id object and store it in 
 * person object's id field.
 **/

PersonSchema.options.toObject = {
  virturals: true,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret.__v;
  }
};

/**
 * Return a person based on an input id
 * Param(s):
 * person_id: String
 **/

PersonSchema.statics.getPersonById = function(person_id) {
    return  Person.findOne( { '_id': ObjectID(person_id)} );
}

/**
 * Remove a person based on an input id
 * Param(s):
 * person_id: String
 **/

PersonSchema.statics.removePersonById = function(person_id) {
    return  Person.deleteOne( { '_id': ObjectID(person_id)} );
}

/**
 * Retrieve person(s) based on an input criteria
 * Param(s):
 * associative array of key: value
 **/

PersonSchema.statics.getPersonByData = function(personData) {
    if (personData.id) {
        personData._id = ObjectID(personData._id);
    }
    return  Person.find( personData );
}

const Person = mongoose.model('Person', PersonSchema);

Person.init().then(() => {
    console.log("Person initialized...");
});

module.exports = Person;
