import { ShuttleModelInterface } from '../models/shuttleModel';
import { predefinedAccess } from '../models/access';

/**
 * Comment
 *
 * @property {ObjectId} parent (required)
 * @property {String} content (required)
 * @property {ObjectId} status
 * @property {Number} likeCount (default:0)
 *
 */

export default {
  name: 'Comment',
  access: predefinedAccess.public,
  hasOwner: true,
  content: {
    parent: 'User.Id!',
    content: 'String!',
    status: 'Status.Id',
    likeCount: 'Number:0',
  },
} as ShuttleModelInterface;
