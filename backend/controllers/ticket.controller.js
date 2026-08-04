import mongoose from "mongoose";
import TicketModel from "../models/ticket.model.js";

export const getTicket = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.user.id);

    if (!id) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const ticket = await TicketModel.find({ user: id });
    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
