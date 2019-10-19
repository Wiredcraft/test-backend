'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const ObjectId = Schema.Types.ObjectId;

    const UserSchema = new Schema({
        basicInfo: {
            name: { type: String, required: true },
            dob: { type: Date, required: true },
            address: { type: String, required: true },
            description: { type: String, required: true },
        },
        following: [{
            user: { type: ObjectId, ref: 'User' },
            valid: { type: Boolean }
        }],
        followers: [{
            user: { type: ObjectId, ref: 'User' },
            valid: { type: Boolean }
        }],
        createdAt: { type: Date, default: Date.now },
        valid: { type: Boolean, default: true }
    });

    return mongoose.model('User', UserSchema);
}