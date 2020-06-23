import mongoose, { model, Schema } from 'mongoose';

export enum AccessType {
  noAccess = 0,
  readOnly = 1,
  fullAccess = 2,
}

/**
 * Note: You should not give
 * everyone, user fullAccess to most things
 */
export interface AccessInterface {
  everyone: AccessType;
  user: AccessType;
  operator: AccessType;
  self: AccessType;
}

export const predefinedAccess = {
  /**
   * Everyone can read, operator and owner have full access
   */
  public: {
    everyone: AccessType.readOnly,
    user: AccessType.readOnly,
    operator: AccessType.fullAccess,
    self: AccessType.fullAccess,
  },
  /**
   * Only authenticated user can read, operator and owner have full access
   */
  userOnly: {
    everyone: AccessType.noAccess,
    user: AccessType.readOnly,
    operator: AccessType.fullAccess,
    self: AccessType.fullAccess,
  },
  /**
   * Operator and owner have full access
   */
  operatorOnly: {
    everyone: AccessType.noAccess,
    user: AccessType.noAccess,
    operator: AccessType.fullAccess,
    self: AccessType.fullAccess,
  },
  /**
   * Operator can read and only owner have full access
   */
  operatorLimited: {
    everyone: AccessType.noAccess,
    user: AccessType.noAccess,
    operator: AccessType.readOnly,
    self: AccessType.fullAccess,
  },
  /**
   * Only owner have full access
   */
  personal: {
    everyone: AccessType.noAccess,
    user: AccessType.noAccess,
    operator: AccessType.noAccess,
    self: AccessType.fullAccess,
  },
  /**
   * Only admin have full access
   */
  adminOnly: {
    everyone: AccessType.noAccess,
    user: AccessType.noAccess,
    operator: AccessType.noAccess,
    self: AccessType.noAccess,
  },
};

const accessSchema = new Schema(
  {
    everyone: {
      required: true,
      type: String,
      enum: Object.values(AccessType),
    },
    user: {
      required: true,
      type: String,
      enum: Object.values(AccessType),
    },
    operator: {
      required: true,
      type: String,
      enum: Object.values(AccessType),
    },
    self: {
      required: true,
      type: String,
      enum: Object.values(AccessType),
    },
  },
  { timestamps: true, collection: 'access' }
);

interface AccessDbInterface extends AccessInterface, mongoose.Document {}
export default model<AccessDbInterface>('Access', accessSchema);
