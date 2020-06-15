import { ShuttleModelInterface } from '../models/shuttleModel';
import { predefinedAccess } from '../models/access';
/**
 * Status
 *
 * @property {String} name (required)
 * @property {String} description
 * @property {String} icon
 *
 */
export default {
  name: 'Status',
  access: predefinedAccess.adminOnly,
  hasOwner: true,
  content: {
    name: 'String!',
    description: 'String',
    icon: 'String',
  },
} as ShuttleModelInterface;
