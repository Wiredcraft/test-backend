import mongoose from 'mongoose';
/**
 * @swagger
 * components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - dob
 *          - address
 *        properties:
 *          id:
 *            type: string
 *            description: Unique id of the user.
 *          name:
 *            type: string
 *          dob:
 *            type: string
 *            format: date
 *            description: Date of Birth in yyyy-mm-dd format.
 *          address:
 *            type: string
 *          description:
 *            type: string
 *          createdAt:
 *            type: string
 *            format: datetime
 *        example:
 *            _id: 6060075025ec841ba5b3a93b
 *            name: Bob
 *            dob: 2000-01-11T00:00:00.000Z
 *            address: ssdfs 363
 *            description: xxxx
 *            createdAt: 2021-03-28T04:34:24.329Z
 */
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
},
{
  versionKey: false
});

module.exports = mongoose.model('Users', UserSchema);
