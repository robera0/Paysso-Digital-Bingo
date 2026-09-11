// src/routes/admin/adminGameRouter.ts
import { Router } from "express";
import {
  AllGame,
  getLiveGames,
  TicketSold,
  updateGame,
} from "../controllers/adminGame.controller.js";

const adminGameRouter = Router();

adminGameRouter.get("/live", getLiveGames);
adminGameRouter.get("/ticket", TicketSold);
adminGameRouter.get("/game", AllGame);
adminGameRouter.put("/game", updateGame);

export default adminGameRouter;
