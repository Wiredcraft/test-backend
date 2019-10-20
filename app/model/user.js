'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const ObjectId = Schema.Types.ObjectId;

    const UserRefSchema = new Schema({
        user: { type: ObjectId, ref: 'User' },
        valid: { type: Boolean, default: true }
    }, { versionKey: false, timestamps: true });

    const UserSchema = new Schema({
        basicInfo: {
            name: { type: String, required: true },
            dob: { type: Date, required: true },
            address: { type: String, required: true },
            description: { type: String, required: true },
        },
        following: [UserRefSchema],
        followers: [UserRefSchema],
        valid: { type: Boolean, default: true }
    }, { versionKey: false, timestamps: true });

    return mongoose.model('User', UserSchema);
}