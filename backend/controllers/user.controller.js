import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

export const getUser = async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.user.id);
  try {
    const user = await UserModel.findById({ _id: id });
    return res.status(200).json({ profile: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
