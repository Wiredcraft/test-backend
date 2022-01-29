import mongoose from "mongoose";

export const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    required: false,
  },
});
