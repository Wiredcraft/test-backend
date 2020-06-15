import { ShuttleModelInterface } from '../models/shuttleModel';
import { predefinedAccess } from '../models/access';

/**
 * Link
 *
 * @property {String} url (required)
 * @property {String} description
 * @property {String} icon
 *
 */
export default {
  name: 'Link',
  access: predefinedAccess.adminOnly,
  hasOwner: false,
  content: {
    url: 'String!',
    description: 'String',
    icon: 'String',
  },
} as ShuttleModelInterface;
