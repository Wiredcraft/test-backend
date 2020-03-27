'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const FollowCountSchema = new Schema({
        userId: { type: mongoose.Types.ObjectId, ref: 'User' },
        followingCount: { type: Number, default: 0 }, // following counts
        followerCount: { type: Number, default: 0 }, // follower/fan counts
    }, { timestamps: true }); // The {timestamps: true} option creates a createdAt and updatedAt field
    
    FollowCountSchema.index({ userId: 1 });

    return mongoose.model('FollowCount', FollowCountSchema);
}

