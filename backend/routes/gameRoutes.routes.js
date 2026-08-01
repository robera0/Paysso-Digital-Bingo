import express from "express";
import { createGame, getGame } from "../controllers/game.controller.js";

const gameRouter = express.Router();

gameRouter.post("/start", createGame);
gameRouter.get("/:gameId", getGame);

export default gameRouter;
