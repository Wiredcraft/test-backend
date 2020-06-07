import mongoose from "mongoose";
import { mongooseHelper } from "../lib";

export const passwordSchema = new mongoose.Schema(
  {
    user: String,
    password: String,
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

class Password {
  /** @type {string} */
  user;
  /** @type {string} */
  password;
}

/**
 * output
 */
passwordSchema.loadClass(Password);
passwordSchema.plugin(mongooseHelper);

let Model = mongoose.model("Password", passwordSchema);

export default Model;
