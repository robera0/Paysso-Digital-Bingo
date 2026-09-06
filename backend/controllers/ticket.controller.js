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

    return res.status(200).json({ success: true, ticket: tickets });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const verifyTicket = async (req, res) => {
  const userId = req.user?.id;
  const { receiptUrl, boxId } = req.body;

  const TOTAL_AMOUNT = "50 Birr";
  const EXPECTED_RECEIVER = "Robera Ararsa Ulu";

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

    if (!isValid || isValid.error || !isValid.receipt) {
      return res.status(400).json({
        message: isValid?.error || "Receipt verification failed or invalid URL",
      });
    }

    const receipt = isValid.receipt;

    if (receipt.transactionStatus !== "Completed") {
      return res.status(400).json({ message: "Transaction is not completed" });
    }

    if (receipt.creditedPartyName !== EXPECTED_RECEIVER) {
      return res
        .status(400)
        .json({ message: "Invalid receiver name on receipt" });
    }

    if (receipt.settledAmount !== TOTAL_AMOUNT) {
      return res.status(400).json({
        message: `Invalid amount. Expected ${TOTAL_AMOUNT}, but receipt shows ${receipt.settledAmount}`,
      });
    }

    if (!receipt.receiptNo) {
      return res
        .status(400)
        .json({ message: "Receipt number is missing from receipt data" });
    }

    const existingTicket = await TicketModel.findOne({
      receiptNo: receipt.receiptNo,
    });
    if (existingTicket) {
      return res
        .status(400)
        .json({ message: "This receipt has already been used." });
    }

    const updatedTicket = await TicketModel.findOneAndUpdate(
      {
        boxId,
      },
      {
        isVerified: true,
        verificationExpiresAt: null,
        expired: false,
        receiptNo: receipt.receiptNo,
      },
      { returnDocument: "after" },
    );

    if (!updatedTicket) {
      return res.status(404).json({
        message: "No unverified ticket found for this box and user",
      });
    }

    return res.status(200).json({
      message: "Payment verified successfully",
      ticket: updatedTicket,
    });
  } catch (err) {
    console.error("verifyTicket Error:", err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "This receipt has already been used." });
    }
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};
