import mongoose from "mongoose";
import GameSession from "../models/Game.model.js";
import TicketModel from "../models/ticket.model.js";
import redis from "../config/redis.js";
import { clearGameCache } from "../config/redis.js";
export const createGame = async (req, res) => {
  try {
    const newGame = await GameSession.createFreshGame();
    console.log(newGame);
    await clearGameCache();
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
    const cacheKey = "game";

    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log(" Redis GAME CACHE HIT");

      const cachedGame = JSON.parse(cached);

      return res.json({
        success: true,
        ...cachedGame,
      });
    }
    console.log(" Redis GAME CACHE MISS");

    const game = await GameSession.findOne();

    if (!game) {
      return res
        .status(404)
        .json({ success: false, error: "Game session not found." });
    }
    const expiredTickets = await TicketModel.find({
      isVerified: false,
      verificationExpiresAt: { $lt: new Date() },
      expired: { $ne: true },
    });

    await Promise.all(
      expiredTickets.map(async (ticket) => {
        await GameSession.findOneAndUpdate(
          {
            _id: game._id,
            "boxes._id": ticket.boxId,
          },
          {
            $set: {
              "boxes.$[box].isOpened": false,
              "boxes.$[box].openedBy": null,
              "boxes.$[box].openedAt": null,
            },
          },
          {
            arrayFilters: [{ "box._id": ticket.boxId }],
          },
        );

        await TicketModel.findByIdAndUpdate(ticket._id, {
          expired: true,
        });
      }),
    );
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    await TicketModel.deleteMany({
      expired: true,
      isVerified: false,
      verificationExpiresAt: { $lt: fiveMinutesAgo },
    });
    const newGame = await GameSession.findOne();

    const updatedGame = expiredTickets.length ? newGame : game;

    const sanitizedBoxes = updatedGame?.boxes?.map((box) => ({
      _id: box?._id,
      boxNumber: box?.boxNumber,
      isOpened: box?.isOpened,
      openedBy: box?.openedBy,
      openedAt: box?.openedAt,
      prize: box?.isOpened ? box?.prize : null,
    }));

    const responseData = {
      gameId: game._id,
      status: game.status,
      remainingBoxes: game.remainingBoxes,
      boxes: sanitizedBoxes,
    };

    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 5);
    console.log(" Data stored in Redis");

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
  if (!req.user?.id || !req.body.gameId || !req.body.boxNumber) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required parameters." });
  }
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const { gameId, boxNumber } = req.body;
  const MAX_TICKETS_PER_USER = 3;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const ticketCount = await TicketModel.countDocuments({
      user: userId,
      $or: [
        { isVerified: true },
        { verificationExpiresAt: { $gt: new Date() } },
      ],
    }).session(session);
    if (ticketCount >= MAX_TICKETS_PER_USER) {
      return res.status(400).json({
        message: `You can only purchase up to ${MAX_TICKETS_PER_USER} tickets`,
      });
    }

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

    if (!claimedBox) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, error: "Box not found." });
    }

    const newTicket = await TicketModel.create(
      [
        {
          gameId: gameId,
          user: userId,
          boxId: claimedBox._id,
          isVerified: false,
          verificationExpiresAt: expireAt,
          expired: false,
        },
      ],
      { session },
    );
    if (updatedGame.remainingBoxes === 0) {
      await GameSession.findByIdAndUpdate(
        gameId,
        { status: "COMPLETED" },
        { session },
      );
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
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      successful: false,
      message: err.message,
    });
  }
};
