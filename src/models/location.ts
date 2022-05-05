import mongoose from '../db';

const Schema = mongoose.Schema;

// user schema
const LocationSchema = new Schema({
  // userId: { type: String, required: true, ref: 'User' },                      // user ID
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  loc: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  }
  // lng: { type: Number }, // -68     // longitude 经度
  // lat: { type: Number }, // 30.2    // latitude 纬度
}, {
  timestamps: { currentTime: () => new Date }
});
// 2d convert 地球的赤道半径约为3,963.2 英里或6,378.1千米
// Number(6378.1 * Math.PI / 180.0)

LocationSchema.index({ loc: '2dsphere'});

export default mongoose.model('Location', LocationSchema);
