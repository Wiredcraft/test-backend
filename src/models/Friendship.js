import mongoose from 'mongoose';
/**
 * @swagger
 * components:
 *    schemas:
 *      Friendship:
 *        type: object
 *        required:
 *          - followeeId
 *          - followerId
 *        properties:
 *          _id:
 *            type: string
 *            description: Unique id of the friendship.
 *          followeeId:
 *            type: string
 *          followerId:
 *            type: string
 *          createdAt:
 *            type: string
 *            format: datetime
 *        example:
 *          _id: 6076eaa3feda09e58def362d
 *          followeeId: 6076c3f2d36ecedf3e22c366
 *          followerId: 6076ab538041f6d9c353289d
 *          createdAt: 2021-04-14T13:14:11.768Z
 */
const FriendshipSchema = mongoose.Schema({
  followeeId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  followerId: {
    type:  mongoose.Types.ObjectId,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
},
{
  versionKey: false
});

module.exports = mongoose.model('Friendship', FriendshipSchema);
