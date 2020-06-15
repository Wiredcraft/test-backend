import { ShuttleModelInterface } from '../models/shuttleModel';
import { predefinedAccess } from '../models/access';
/**
 * Note
 *
 * @property {String} title (required)
 * @property {String} content (required)
 * @property {Array<ObjectId>} tags
 * @property {ObjectId} status
 * @property {Array<ObjectId>} images
 * @property {Number} likeCount (default:0)
 *
 */
export default {
  name: 'Note',
  access: predefinedAccess.operatorOnly,
  hasOwner: true,
  content: {
    title: 'String!',
    content: 'String!',
    tags: ['Tag.Id'],
    status: 'Status.Id',
    images: ['Image.Id'],
    likeCount: 'Number:0',
  },
} as ShuttleModelInterface;
