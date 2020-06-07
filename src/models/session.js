import mongoose from "mongoose";
import { mongooseHelper } from "../lib";

export const sessionSchema = new mongoose.Schema(
  {
    user: String,
    type: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

class Session {
  /** @type {string} */
  user;
  /** @type {string} */
  type;
}

/**
 * output
 */
sessionSchema.loadClass(Session);
sessionSchema.plugin(mongooseHelper);

let Model = mongoose.model("Session", sessionSchema);

export default Model;
