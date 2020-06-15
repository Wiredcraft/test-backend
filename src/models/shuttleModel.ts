import mongoose, { Schema } from 'mongoose';
import { AccessInterface } from './access';

/**
 * Shuttle Model
 *
 * @property {String} name
 * @property {AccessInterface} access
 * @property {Boolean} hasOwner
 * @property {String} content schema string
 *
 */
const shuttleSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    access: {
      required: true,
      type: Schema.Types.Mixed,
    },
    hasOwner: {
      required: true,
      type: Boolean,
    },
    content: {
      required: true,
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true, collection: 'shuttleModel' }
);

/**
 * ShuttleModelInterface
 *
 * @property {string} name (required)
 * @property {AccessInterface} access
 * @property {boolean} hasOwner
 * @property {ShuttleModelSchema} content
 *
 */
export interface ShuttleModelInterface {
  name: string;
  access: AccessInterface;
  hasOwner: boolean;
  content: ShuttleModelSchema;
}

/**
 * Must maches owner have full access
 */
export interface ShuttleModelSchema {
  [key: string]: ShuttleModelProperty;
}

export type ShuttleModelProperty = string | string[] | ShuttleModelProperty[];

export const shuttleModelConsts = {
  // (ref.)type(:default)(!)
  regex: /^(?<ref>[a-zA-Z]+\.)?((?<type>[a-zA-Z]+))(:(?<default>.+))?(?<required>!)?$/,
  supportedTypes: ['String', 'Number', 'Date', 'Boolean', 'Id'],
};

/**
 * Currently will only check top level types
 * @returns {boolean} whether the object is a shuttle model
 */
export function isShuttleModel(input: any): input is ShuttleModelInterface {
  return (
    input &&
    input.name &&
    input.access &&
    Object.hasOwnProperty.call(input, 'hasOwner') &&
    input.content &&
    typeof input.name === 'string' &&
    typeof input.access === 'object' &&
    typeof input.hasOwner === 'boolean' &&
    typeof input.content === 'object'
  );
}

export type supportedInterface =
  | 'String'
  | 'Number'
  | 'Date'
  | 'Boolean'
  | 'ObjectId';

interface ShuttleModelDbInterface
  extends ShuttleModelInterface,
    mongoose.Document {}
export default mongoose.model<ShuttleModelDbInterface>(
  'ShuttleModel',
  shuttleSchema
);
