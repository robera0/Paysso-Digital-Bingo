// src/routes/admin/adminGameRouter.ts
import { Router } from "express";
import {
  AllGame,
  deleteGame,
  getLiveGames,
  getWinner,
  TicketSold,
  updateGame,
} from "../controllers/adminGame.controller.js";
import { authenticateTokenMiddleware } from "../middleware/authenticateToken.middleware.js";

const adminGameRouter = Router();
adminGameRouter.get("/winner", getWinner);
adminGameRouter.get("/live", authenticateTokenMiddleware, getLiveGames);
adminGameRouter.get("/ticket", authenticateTokenMiddleware, TicketSold);
adminGameRouter.get("/game", authenticateTokenMiddleware, AllGame);
adminGameRouter.put("/game", authenticateTokenMiddleware, updateGame);
adminGameRouter.delete(
  "/game/:gameId",
  authenticateTokenMiddleware,
  deleteGame,
);

export default adminGameRouter;
