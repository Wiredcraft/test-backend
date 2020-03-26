'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const AuthorizationSchema = new Schema({
        provider: { type: String }, // provider name, like auth0, github, twitter, facebook, weibo and so on
        uid: { type: String },  // provider unique id
        userId: { type: mongoose.Types.ObjectId, ref: 'User' }, // current application user id
        meta: { type: Schema.Types.Mixed, required: true },
    }, { timestamps: true }); // The {timestamps: true} option creates a createdAt and updatedAt field
    
    AuthorizationSchema.index({ uid: 1, provider: 1 }, { unique: true });

    return mongoose.model('Authorization', AuthorizationSchema);
}

