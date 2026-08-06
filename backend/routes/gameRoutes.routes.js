import express from "express";
import {
  createGame,
  getGame,
  PurchaseBox,
} from "../controllers/game.controller.js";
import { authenticateTokenMiddleware } from "../middleware/authenticateToken.middleware.js";

const gameRouter = express.Router();

gameRouter.post("/start", createGame);
gameRouter.get("/newGame", getGame);

export default gameRouter;
