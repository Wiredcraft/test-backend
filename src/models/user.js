import mongoose from "mongoose";
import { mongooseHelper } from "../lib";

export const userSchema = new mongoose.Schema(
  {
    name: String,
    dob: String,
    address: String,
    description: String,
    github: String,
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

class User {
  /** @type {string} */
  name;
  /** @type {string} */
  dob;
  /** @type {string} */
  address;
  /** @type {string} */
  description;
  /** @type {string} */
  github;
  /** @type {timestamps} */
  createdAt;
}

/**
 * output
 */
userSchema.loadClass(User);
userSchema.plugin(mongooseHelper);

let Model = mongoose.model("User", userSchema);

export default Model;
