import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameSession",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    expired: {
      type: Boolean,
      default: false,
    },
    verificationExpiresAt: {
      type: Date,
      default: null,
    },
    boxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameSession",
      required: true,
    },
  },
  { timestamps: true },
);

const TicketModel = mongoose.model("Ticket", ticketSchema);

export default TicketModel;
