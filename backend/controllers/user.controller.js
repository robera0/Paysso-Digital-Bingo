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

export const updateUser = async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.user.id);
  const { email, password, phone, fullName, username } = req.body;

  if (!id)
    return res.status(400).json({ success: false, error: "Missing id." });
  try {
    const updateData = {
      email,
      password,
      phone,
      fullName,
      username,
    };

    // delete undefined values
    Object.keys(updateData).forEach(
      (key) =>
        (updateData[key] === undefined || updateData[key] === "") &&
        delete updateData[key],
    );

    const existingUser = await UserModel.findOne({
      _id: { $ne: id }, // exclude the current user
      $or: [...(email ? [{ email }] : []), ...(username ? [{ username }] : [])],
    });

    if (email && existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({
          success: false,
          error: "Email already exists.",
        });
      }

      if (username && existingUser.username === username) {
        return res.status(409).json({
          success: false,
          error: "Username already exists.",
        });
      }
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: updateData,
      },
      { returnDocument: "after" },
    );

    return res.status(200).json({ profile: updateUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
