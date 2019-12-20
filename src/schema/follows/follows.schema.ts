import { Schema } from 'mongoose';
export const FollowsSchema = new Schema({
    uid: { type: Schema.Types.ObjectId, ref: 'User' },
    followId: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now() },
});
