import GameSession from "../models/Game.model.js";

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
    const game = await GameSession.findById(req.params.gameId).lean();

    if (!game) {
      return res
        .status(404)
        .json({ success: false, error: "Game session not found." });
    }

    const sanitizedBoxes = game.boxes.map((box) => ({
      boxNumber: box.boxNumber,
      isOpened: box.isOpened,
      openedBy: box.openedBy,
      openedAt: box.openedAt,

      prize: box.isOpened ? box.prize : null,
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
  try {
    const { gameId, userId, boxNumber } = req.body;
    if (!gameId || !boxNumber || !userId) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required parameters." });
    }

    const updateGame = await GameSession.findOneAndUpdate(
      {
        _id: gameId,
        status: "ACTIVE",
        boxes: {
          $elemMatch: {
            boxNumber: boxNumber,
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
      { new: true },
    );

    if (!updatedGame) {
      return res.status(409).json({
        success: false,
        error:
          "Box was already purchased by another player! No funds were deducted.",
      });
    }

    const claimedBox = updatedGame.boxes.find((b) => b.boxNumber === boxNumber);

    if (updatedGame.remainingBoxes === 0) {
      await GameSession.findByIdAndUpdate(gameId, { status: "COMPLETED" });
    }

    res.json({
      success: true,
      message: `Box #${boxNumber} purchased successfully!`,
      chargedAmount: ticketCost,
      newBalance: user.balance,
      prize: claimedBox.prize,
    });
  } catch (err) {
    res.status(500).json({
      successful: false,
      message: err.message,
    });
  }
};
