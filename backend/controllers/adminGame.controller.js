import GameSession from "../models/Game.model.js";
import TicketModel from "../models/ticket.model.js";
import UserModel from "../models/user.model.js";
import { clearGameCache } from "../config/redis.js";
import redis from "../config/redis.js";

export const getLiveGames = async (req, res) => {
  try {
    const liveGames = await GameSession.countDocuments({ status: "ACTIVE" });
    const activeUsers = await UserModel.countDocuments();
    const Game = await GameSession.find();
    const GameAnalytics = await GameSession.aggregate([
      { $match: { status: "ACTIVE" } },
      {
        $unwind: "$boxes",
      },
      {
        $match: { "boxes.isOpened": true },
      },

      {
        $lookup: {
          from: "tickets",
          localField: "boxes._id",
          foreignField: "boxId",
          as: "ticketInfo",
        },
      },

      { $unwind: "$ticketInfo" },

      {
        $project: {
          _id: 0,
          gameId: "$_id",
          boxId: "$boxes._id",
          boxNumber: "$boxes.boxNumber",
          isOpened: "$boxes.isOpened",
          openedBy: "$boxes.openedBy",
          openedAt: "$boxes.openedAt",
          prize: "$boxes.prize",
          ticketId: "$ticketInfo._id",
          isVerified: "$ticketInfo.isVerified",
          verifiedAt: "$ticketInfo.createdAt",
        },
      },
    ]);

    const unverifiedTicket = GameAnalytics.filter(
      (item) => !item.isVerified,
    ).length;
    const soldTickets = GameAnalytics.filter((item) => item.isVerified).length;
    const OpenedBox = GameAnalytics.filter((item) => item.isOpened).length;
    res.status(200).json({
      activeGame: liveGames,
      ActiveUsers: activeUsers,
      GameAnalytics: GameAnalytics,
      unverifiedTicket: unverifiedTicket,
      OpenedBox: OpenedBox,
      soldTickets: soldTickets,
      Games: Game,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const AllGame = async (req, res) => {
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
    const games = await GameSession.find().lean();

    if (!games || games.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Game sessions not found." });
    }

    const sanitizedGame = await Promise.all(
      games.map(async (g) => {
        const ticketSold = await TicketModel.countDocuments({
          gameId: g._id,
          isVerified: true,
        });

        const prizePool = (g.boxes || []).reduce((sum, box) => {
          return sum + Number(box?.prize?.value || 0);
        }, 0);

        return {
          gameId: g._id,
          gameName: g.gameName,
          prizePool,
          ticketSold,
          boxes: g.boxes?.map((box) => ({
            _id: box._id,
            isOpened: box.isOpened,
            openedBy: box.openedBy,
            openedAt: box.openedAt,
            prize: box.isOpened ? box.prize : null,
          })),
          status: g.status,
          price: g.price,
          remainingBoxes: g.remainingBoxes,
        };
      }),
    );

    await redis.set(
      cacheKey,
      JSON.stringify({ Games: sanitizedGame }),
      "EX",
      5,
    );
    console.log(" Data stored in Redis");

    return res.json({
      success: true,
      Games: sanitizedGame,
      sanitizedGame,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const TicketSold = async (req, res) => {
  try {
    const SoldTickets = await TicketModel.countDocuments({ isVerified: true });
    const TotalRevenue = await TicketModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$price",
          },
        },
      },
    ]);
    res.status(200).json({
      TicketSold: SoldTickets,
      TotalRevenue: TotalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
