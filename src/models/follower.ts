import mongoose from '../db';

const Schema = mongoose.Schema;

// user schema
const FollowerSchema = new Schema({
  // starUserId: { type: String, required: true },                      // start user ID
  // fansUserId: { type: String, required: true }, // 'test',            // funs user ID
  starUserId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },                      // start user ID
  fansUserId: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, // 'test',            // funs user ID
  isFollowing: { type: String, default: 'Y' }, //      // whether follow
  // createdAt: { type: Date, default: Date.now },    // user created date
  // updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: { currentTime: () => new Date }
});

export default mongoose.model('Follower', FollowerSchema);
