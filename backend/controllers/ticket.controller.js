import mongoose from "mongoose";
import TicketModel from "../models/ticket.model.js";
import verifyReceipt from "../services/verifyReceipt.js";
import GameSession from "../models/Game.model.js";

export const getTicket = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await TicketModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },

      {
        $lookup: {
          from: "gamesessions",
          localField: "boxId",
          foreignField: "boxes._id",
          as: "gameSession",
        },
      },
      { $unwind: "$gameSession" },

      {
        $addFields: {
          box: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$gameSession.boxes",
                  as: "b",
                  cond: { $eq: ["$$b._id", "$boxId"] },
                },
              },
              0,
            ],
          },
        },
      },

      {
        $project: {
          _id: 1,
          isVerified: 1,
          expired: 1,
          gameSessionId: "$gameSession._id",
          boxNumber: "$box.boxNumber",
          prize: "$box.prize",
          isOpened: "$box.isOpened",
          boxId: 1,
          createdAt: 1,
          updatedAt: 1,
          verificationExpiresAt: 1,
        },
      },
    ]);

    // Return property name `ticket` to match frontend expectation
    return res.status(200).json({ success: true, ticket: tickets });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/*

{
  "source": "telebirr-html",
  "payerName": "<payer name>",
  "payerTelebirrNo": "251********",
  "payerAccountType": "Individual Customer",
  "creditedPartyName": "<merchant or recipient name>",
  "creditedPartyAccountNo": "251********",
  "transactionStatus": "Completed",
  "receiptNo": "ABCD1234EF",
  "paymentDate": "01-01-2026 00:00:00",
  "settledAmount": "100 Birr",
  "serviceFee": "1.74 Birr",
  "serviceFeeVAT": "0.26 Birr",
  "totalPaidAmount": "102 Birr",
  "paymentReason": "Send Money to Registered Customer",
  "paymentMode": "telebirr",
  "paymentChannel": "API/App"
}
*/

export const verifyTicket = async (req, res) => {
  const userId = req.user?.id;
  const { receiptUrl, boxId } = req.body;

  if (!userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User token is required" });
  }
  if (!receiptUrl || !boxId) {
    return res
      .status(400)
      .json({ message: "Both receiptUrl and boxId are required" });
  }

  try {
    const isValid = await verifyReceipt(receiptUrl);

    if (!isValid) {
      return res
        .status(400)
        .json({ message: "Receipt verification failed or invalid" });
    }

    const updatedTicket = await TicketModel.findOneAndUpdate(
      { boxId },
      {
        isVerified: true,
        verificationExpiresAt: null,
        expired: false,
      },
      { returnDocument: "after" },
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found for this box" });
    }

    return res.status(200).json({
      message: "Payment verified successfully",
      ticket: updatedTicket,
    });
  } catch (err) {
    console.error("verifyTicket Error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};
