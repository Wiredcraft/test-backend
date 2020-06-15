import mongoose, { Schema, model } from 'mongoose';

export enum accessType {
  noAccess = 'noAccess',
  readOnly = 'readOnly',
  fullAccess = 'fullAccess'
}

/**
 * Note: You should not give
 * everyone, user fullAccess to most things
 */
export interface AccessInterface {
  everyone: accessType;
  user: accessType;
  operator: accessType;
  self: accessType;
}

export const predefinedAccess = {
  /**
   * Everyone can read, operator and owner have full access
   */
  public: {
    everyone: accessType.readOnly,
    user: accessType.readOnly,
    operator: accessType.fullAccess,
    self: accessType.fullAccess
  } as AccessInterface,
  /**
   * Only authed user can read, operator and owner have full access
   */
  userOnly: {
    everyone: accessType.noAccess,
    user: accessType.readOnly,
    operator: accessType.fullAccess,
    self: accessType.fullAccess
  } as AccessInterface,
  /**
   * Operator and owner have full access
   */
  operatorOnly: {
    everyone: accessType.noAccess,
    user: accessType.noAccess,
    operator: accessType.fullAccess,
    self: accessType.fullAccess
  } as AccessInterface,
  /**
   * Operator can read and only owner have full access
   */
  operatorLimited: {
    everyone: accessType.noAccess,
    user: accessType.noAccess,
    operator: accessType.readOnly,
    self: accessType.fullAccess
  } as AccessInterface,
  /**
   * Only owner have full access
   */
  personal: {
    everyone: accessType.noAccess,
    user: accessType.noAccess,
    operator: accessType.noAccess,
    self: accessType.fullAccess
  } as AccessInterface,
  /**
   * Only admin have full access
   */
  adminOnly: {
    everyone: accessType.noAccess,
    user: accessType.noAccess,
    operator: accessType.noAccess,
    self: accessType.noAccess
  } as AccessInterface
};

const accessSchema = new Schema(
  {
    everyone: {
      required: true,
      type: String,
      enum: Object.values(accessType)
    },
    user: {
      required: true,
      type: String,
      enum: Object.values(accessType)
    },
    operator: {
      required: true,
      type: String,
      enum: Object.values(accessType)
    },
    self: {
      required: true,
      type: String,
      enum: Object.values(accessType)
    }
  },
  { timestamps: true, collection: 'access' }
);

interface AccessDbInterface extends AccessInterface, mongoose.Document {}
export default model<AccessDbInterface>('Access', accessSchema);
