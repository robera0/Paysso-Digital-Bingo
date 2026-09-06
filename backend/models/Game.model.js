import mongoose from "mongoose";

const BoxSchema = new mongoose.Schema({
  boxNumber: { type: Number, required: true },
  prize: {
    type: { type: String, required: true },
    value: { type: Number, default: 0 },
    amount: Number,
  },
  isOpened: { type: Boolean, default: false },
  openedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  openedAt: { type: Date, default: null },
});

const GameSessionSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["ACTIVE", "PAUSED", "COMPLETED"],
      default: "PAUSED",
    },
    gameName: String,
    remainingBoxes: { type: Number, default: 100 },
    boxes: [BoxSchema],
    price: {
      type: Number,
      required: true,
      default: 100,
    },
  },

  { timestamps: true },
);

const GameSession = mongoose.model("gamesessions", GameSessionSchema);

export default GameSession;
