import mongoose from '../db';

const Schema = mongoose.Schema;

// user schema
const UserSchema = new Schema({
  // id: { type: String }, // 'xxx',                  // user ID
  name: { type: String }, // 'test',               // user name
  password: { type: String },                     // user password
  dob: { type: Date }, // '',                     // date of birth
  address: { type: String }, //'',                // user address
  description: { type: String }, //'',            // user description
  isDeleted: { type: String, default: 'N' }, //              // user is deleted
  // createdAt: { type: Date, default: Date.now }, // '' // user created date
  // updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: { currentTime: () => new Date }
});

export default mongoose.model('User', UserSchema);
