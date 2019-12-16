let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectID = require('mongodb').ObjectID;

const PersonSchema = new Schema({
  name: {
    type: String,
    trim: true,
    index: true,
    required: true
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
  position: { 
      type: {
          type: String,
          default: 'Point'
      },
      coordinates: {
          type: [Number],
          index: '2dsphere',
          required: true
      }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

PersonSchema.index({position: '2dsphere'});
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

PersonSchema.statics.getPersonById = (person_id) => {
    return  Person.findOne( { '_id': ObjectID(person_id)} );
}

/**
 * Remove a person based on an input id
 * Param(s):
 * person_id: String
 **/

PersonSchema.statics.removePersonById = (person_id) => {
    return  Person.deleteOne( { '_id': ObjectID(person_id)} );
}

/**
 * Retrieve person(s) based on an input criteria
 * Param(s):
 * associative array of key: value
 **/

PersonSchema.statics.getPersonByData = (personData) => {
    if (personData.id) {
        personData._id = ObjectID(personData._id);
    }
    return  Person.find( personData );
}

/**
 * Find persons within a certain distance of coordinates
 *
 * @param: location -  object based on the location field
 * @param: distance -  Integer - max distance, in meters, from the provided location
 **/
PersonSchema.statics.findPersonInRange = (coords, distance) => {
    coords.type = "Point";

    return Person.find({
        "position": {
            "$geoNear": {
                "$geometry": coords,
                "$maxDistance": distance
            },
        }});
}

/**
 * Find persons within a certain distance of another person 
 *
 * @param: location -  object based on the location field
 * @param: distance -  Integer - max distance, in meters, from the provided location
 **/
PersonSchema.statics.findPersonInRangeOfId = (person, distance) => {

    return Person.find({
        "position": {
            "$geoNear": {
                "$geometry": person.position,
                "$maxDistance": distance,
                "query" : { "id" : {"$ne" : person._id}}
            },
        }});
}

const Person = mongoose.model('Person', PersonSchema);

Person.init().then(() => {
    console.log("Person initialized...");
});

module.exports = Person;
