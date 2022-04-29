import mongoose from '../db';

const Schema = mongoose.Schema;

// user schema
const LoginLogSchema = new Schema({
  userId: { type: String }, // 'test',               // login ip
  ip: { type: String },
  userAgent: { type: String }                     // user login devices or application info
  // createdAt: { type: Date, default: Date.now }, // '' // user created date
  // updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true
});

// LoginLogSchema.pre('save', function(next) {
//   // this.id = new mongoose.Types.ObjectId().toHexString();
//   this.updatedAt = new Date();
//   next();
// });

export default mongoose.model('LoginLog', LoginLogSchema);
