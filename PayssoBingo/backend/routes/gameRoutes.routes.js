import express from "express";
import {
  createGame,
  getGame,
  PurchaseBox,
} from "../controllers/game.controller.js";

const gameRouter = express.Router();

gameRouter.post("/start", createGame);
gameRouter.get("/newGame", getGame);
gameRouter.post("/ticket", PurchaseBox);

export default gameRouter;
