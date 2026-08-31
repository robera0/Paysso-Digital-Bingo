import GameSession from "../models/Game.model.js";
import TicketModel from "../models/ticket.model.js";
import UserModel from "../models/user.model.js";
export const getLiveGames = async (req, res) => {
  try {
    const liveGames = await GameSession.countDocuments({ status: "ACTIVE" });
    const activeUsers = await UserModel.countDocuments();
    const GameAnalytics = await GameSession.aggregate([
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
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
