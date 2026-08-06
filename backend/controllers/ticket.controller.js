import mongoose from "mongoose";
import TicketModel from "../models/ticket.model.js";
import verifyReceipt from "../services/verifyReceipt.js";
export const getTicket = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.user.id);

    if (!id) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const ticket = await TicketModel.find({ user: id });
    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  const { receiptUrl, boxId } = req.body;

  if (!receiptUrl) {
    return res.status(400).json({ message: "receiptUrl is required" });
  }
  try {
    const result = await verifyReceipt(receiptUrl);

    if (result) {
      const updatedTicket = await TicketModel.findOneAndUpdate(
        { boxId: boxId },
        {
          isVerified: true,
          verificationExpiresAt: null,
        },
      );

      {
        returnDocument: "after";
      }
    }
    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found for this box" });
    }
    return res
      .status(200)
      .json({ message: "Payment verified", ticket: updatedTicket });
  } catch (err) {
    process.env.ODIT_API_KEY;
    res.status(500).json({ message: err.message });
  }
};
