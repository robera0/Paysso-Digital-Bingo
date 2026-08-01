import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: string,
      required: true,
    },
    password: {
      type: string,
      required: true,
    },
  },
  { timestamps: true },
);

export const userModel = mongoose.model("User", userSchema);
