import express from "express";
import {
  createGame,
  getGame,
  uploadPrizeImages,
} from "../controllers/game.controller.js";
import { authenticateTokenMiddleware } from "../middleware/authenticateToken.middleware.js";
const gameRouter = express.Router();

gameRouter.post(
  "/create",
  uploadPrizeImages,
  authenticateTokenMiddleware,
  createGame,
);
gameRouter.post(
  "/start",
  uploadPrizeImages,
  authenticateTokenMiddleware,
  createGame,
);
gameRouter.get("/new-game", getGame);

export default gameRouter;
