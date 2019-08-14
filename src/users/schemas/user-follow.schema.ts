import * as mongoose from "mongoose";

export const UserFollowSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        index: true,
        default: Date.now,
    }
});

UserFollowSchema.index({ from: 1, to: 1 }, { unique: 1 });