import mongoose from "mongoose";
import GameSession from "../models/Game.model.js";
import TicketModel from "../models/ticket.model.js";
import redis from "../config/redis.js";
import { clearGameCache } from "../config/redis.js";
import crypto from "crypto";

export const createGame = async (req, res) => {
  try {
    const { gameName, prize = [], boxNumber, value = [], price } = req.body;

    const totalBoxes = Number(boxNumber);
    if (isNaN(totalBoxes) || totalBoxes < 10) {
      return res.status(400).json({
        success: false,
        message: "boxNumber must be a valid number and at least 10",
      });
    }

    if (!Array.isArray(prize) || prize.length < 3) {
      return res.status(400).json({
        success: false,
        message:
          "prize must be an array with at least 3 items [tier1, tier2, tier3]",
      });
    }
    const [FIRST_PRIZE, SECOND_PRIZE, THIRD_PRIZE] = prize;

    const noPrizeBoxes = totalBoxes - 10;

    const prizePool = [
      ...Array.from({ length: 1 }, () => ({
        type: FIRST_PRIZE,
        value: Number(value[0]) || 0,
      })),
      ...Array.from({ length: 3 }, () => ({
        type: SECOND_PRIZE,
        value: Number(value[1]) || 0,
      })),
      ...Array.from({ length: 6 }, () => ({
        type: THIRD_PRIZE,
        value: Number(value[2]) || 0,
      })),
      ...Array.from({ length: noPrizeBoxes }, () => ({
        type: "NO_PRIZE",
        value: Number(value[3]) || 0,
      })),
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

    // 4. Persist new session
    const newSession = await GameSession.create({
      boxes,
      remainingBoxes: boxes.length,
      price,
      status: "ACTIVE",
      gameName,
    });
    await clearGameCache();

    return res.status(201).json({
      success: true,
      data: newSession,
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

    // 1. Check Redis
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(" Redis GAME CACHE HIT");
      return res.json({
        success: true,
        ...JSON.parse(cached),
      });
    }

    console.log(" Redis GAME CACHE MISS");

    // 2. Fetch Active Game
    let game = await GameSession.findOne({ status: "ACTIVE" }).lean();

    if (!game) {
      return res
        .status(404)
        .json({ success: false, error: "Game session not found." });
    }

    // 3. Process Expired Tickets
    const expiredTickets = await TicketModel.find({
      isVerified: false,
      verificationExpiresAt: { $lt: new Date() },
      expired: { $ne: true },
    });

    if (expiredTickets.length > 0) {
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
              $inc: { remainingBoxes: 1 },
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

      game = await GameSession.findById(game._id).lean();
    }

    const sanitizedBoxes = game?.boxes?.map((box) => ({
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
      price: game.price,
      remainingBoxes: game.remainingBoxes,
      boxes: sanitizedBoxes,
    };

    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 5);
    console.log(" Data stored in Redis");

    return res.json({
      success: true,
      ...responseData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
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
          price: updatedGame.price,
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
