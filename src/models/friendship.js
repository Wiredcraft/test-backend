import mongoose from "mongoose";
import { mongooseHelper } from "../lib";

export const friendshipSchema = new mongoose.Schema(
  {
    from: String,
    to: String,
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

class Friendship {
  /** @type {string} */
  from;
  /** @type {string} */
  to;
}

/**
 * output
 */
friendshipSchema.loadClass(Friendship);
friendshipSchema.plugin(mongooseHelper);

let Model = mongoose.model("Friendship", friendshipSchema);

export default Model;
