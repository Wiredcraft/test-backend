import mongoose, { Schema, model } from 'mongoose';

export enum AccessType {
  noAccess = 'noAccess',
  readOnly = 'readOnly',
  fullAccess = 'fullAccess',
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
  } as AccessInterface,
  /**
   * Only authed user can read, operator and owner have full access
   */
  userOnly: {
    everyone: AccessType.noAccess,
    user: AccessType.readOnly,
    operator: AccessType.fullAccess,
    self: AccessType.fullAccess,
  } as AccessInterface,
  /**
   * Operator and owner have full access
   */
  operatorOnly: {
    everyone: AccessType.noAccess,
    user: AccessType.noAccess,
    operator: AccessType.fullAccess,
    self: AccessType.fullAccess,
  } as AccessInterface,
  /**
   * Operator can read and only owner have full access
   */
  operatorLimited: {
    everyone: AccessType.noAccess,
    user: AccessType.noAccess,
    operator: AccessType.readOnly,
    self: AccessType.fullAccess,
  } as AccessInterface,
  /**
   * Only owner have full access
   */
  personal: {
    everyone: AccessType.noAccess,
    user: AccessType.noAccess,
    operator: AccessType.noAccess,
    self: AccessType.fullAccess,
  } as AccessInterface,
  /**
   * Only admin have full access
   */
  adminOnly: {
    everyone: AccessType.noAccess,
    user: AccessType.noAccess,
    operator: AccessType.noAccess,
    self: AccessType.noAccess,
  } as AccessInterface,
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
