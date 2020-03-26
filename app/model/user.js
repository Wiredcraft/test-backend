'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const PointSchema = new mongoose.Schema({
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    });

    const UserSchema = new Schema({
        name: { type: String }, // user name
        avatar: { type: String }, // user avatar
        dob: { type: String },  // date of birth
        address: { type: String }, // user address
        description: { type: String }, // user description
        location: { 
            type: PointSchema,
            required: true,
            index: { type: '2dsphere', sparse: true }
         },
         isAdmin: { type: String, default: false } // user role
    }, { timestamps: true }); // The {timestamps: true} option creates a createdAt and updatedAt field
    
    // Create a virtual property `id` that's computed from `_id` and as `user ID` 
    UserSchema.virtual('id').get(function(){
        return this._id.toHexString();
    });

    return mongoose.model('User', UserSchema);
}

