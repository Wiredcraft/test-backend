import mongoose from '../db';

const Schema = mongoose.Schema;

// user schema
const LoginLogSchema = new Schema({
  // id: { type: String }, // 'xxx',                  // user ID
  userId: { type: String }, // 'test',               // 登录ip
  ip: { type: String },                     // user login ip
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
