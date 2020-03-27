'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const FollowingSchema = new Schema({
        userId: { type: mongoose.Types.ObjectId, ref: 'User' },
        target: { type: mongoose.Types.ObjectId, ref: 'User' }, // following user ID
    }, { timestamps: true }); // The {timestamps: true} option creates a createdAt and updatedAt field
    
    FollowingSchema.index({ userId: 1 });

    return mongoose.model('Following', FollowingSchema);
}

