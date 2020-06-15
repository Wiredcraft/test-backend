import { ShuttleModelInterface } from '../models/shuttleModel';
import { predefinedAccess } from '../models/access';

/**
 * Note
 *
 * @property {String} title (required)
 * @property {String} content (required)
 * @property {Array<ObjectId>} tags
 * @property {ObjectId} status
 * @property {ObjectId} headerImg
 * @property {Array<ObjectId>} images
 * @property {Number} viewCount (default:0)
 * @property {Number} likeCount (default:0)
 *
 */

export default {
  name: 'Article',
  access: predefinedAccess.public,
  hasOwner: true,
  content: {
    title: 'String!',
    content: 'String!',
    tags: ['Tag.Id'],
    status: 'Status.Id',
    headerImg: 'Image.Id',
    images: ['Image.Id'],
    viewCount: 'Number:0',
    likeCount: 'Number:0',
  },
} as ShuttleModelInterface;
