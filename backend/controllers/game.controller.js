import mongoose from "mongoose";
import GameSession from "../models/Game.model.js";
import TicketModel from "../models/ticket.model.js";

export const createGame = async (req, res) => {
  try {
    const newGame = await GameSession.createFreshGame();
    console.log(newGame);
    res.status(201).json({
      success: true,
      gameId: newGame._id,
      remainingBoxes: newGame.remainingBoxes,
      status: newGame.status,
    });
  } catch (err) {
    res.status(500).json({
      successful: false,
      message: err.message,
    });
  }
};

export const getGame = async (req, res) => {
  try {
    const game = await GameSession.findOne();

    if (!game) {
      return res
        .status(404)
        .json({ success: false, error: "Game session not found." });
    }

    const sanitizedBoxes = game?.boxes?.map((box) => ({
      boxNumber: box?.boxNumber,
      isOpened: box?.isOpened,
      openedBy: box?.openedBy,
      openedAt: box?.openedAt,

      prize: box?.isOpened ? box?.prize : null,
    }));

    res.json({
      success: true,
      gameId: game._id,
      status: game.status,
      remainingBoxes: game.remainingBoxes,
      boxes: sanitizedBoxes,
    });
  } catch (err) {
    res.status(500).json({
      successful: false,
      message: err.message,
    });
  }
};

export const PurchaseBox = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const { gameId, boxNumber } = req.body;

  if (!gameId || !boxNumber || !userId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required parameters." });
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const expireAt = new Date(Date.now() + 12 * 60 * 1000);

    const updatedGame = await GameSession.findOneAndUpdate(
      {
        _id: gameId,
        status: "ACTIVE",
        boxes: {
          $elemMatch: {
            boxNumber: Number(boxNumber),
            isOpened: false,
          },
        },
      },

      {
        $set: {
          "boxes.$.isOpened": true,
          "boxes.$.openedBy": userId,
          "boxes.$.openedAt": new Date(),
        },
        $inc: { remainingBoxes: -1 },
      },
      { returnDocument: "after", session },
    );

    if (!updatedGame) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, error: "Box unavailable" });
    }

    const claimedBox = updatedGame.boxes.find(
      (b) => b.boxNumber === Number(boxNumber),
    );

    const newTicket = await TicketModel.create(
      [
        {
          gameId: gameId,
          user: userId,
          boxId: updatedGame._id,
          isVerified: false,
          verificationExpiresAt: expireAt,
        },
      ],
      { session },
    );
    if (updatedGame.remainingBoxes === 0) {
      await GameSession.findByIdAndUpdate(gameId, { status: "COMPLETED" });
    }
    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: `Box #${boxNumber} purchased successfully!`,
      ticket: newTicket,
      prize: claimedBox.prize,
    });
  } catch (err) {
    res.status(500).json({
      successful: false,
      message: err.message,
    });
  }
};
