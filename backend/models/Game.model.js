import mongoose from "mongoose";
import crypto from "crypto";

const BoxSchema = new mongoose.Schema({
  boxNumber: { type: Number, required: true },
  prize: {
    type: { type: String, required: true },
    value: { type: Number, default: 0 },
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
      enum: ["ACTIVE", "COMPLETED"],
      default: "ACTIVE",
    },
    remainingBoxes: { type: Number, default: 100 },
    boxes: [BoxSchema],
  },
  { timestamps: true },
);

GameSessionSchema.statics.createFreshGame = async function () {
  const prizePool = [
    ...Array(1).fill({ type: "GRAND_PRIZE", value: 50 }),
    ...Array(99).fill({ type: "NO_PRIZE", value: 0 }),
  ];

  for (let i = prizePool.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);

    [prizePool[i], prizePool[j]] = [prizePool[j], prizePool[i]];
  }

  const boxes = prizePool.map((prize, index) => ({
    boxNumber: index + 1,
    prize: prize,
    isOpened: false,
  }));

  return await this.create({
    boxes: boxes,
    remainingBoxes: 100,
    status: "ACTIVE",
  });
};

const GameSession = mongoose.model("gamesessions", GameSessionSchema);

export default GameSession;
