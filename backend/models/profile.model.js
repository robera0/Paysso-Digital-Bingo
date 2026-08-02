import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    Gender: {
      type: String,
    },
  },
  { timestamps: true },
);
ProfileSchema.index({ User: 1 });

export const ProfileModel = mongoose.model("profile", ProfileSchema);
