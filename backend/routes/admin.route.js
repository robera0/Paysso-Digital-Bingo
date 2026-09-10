// src/routes/admin/adminGameRouter.ts
import { Router } from "express";
import {
  AllGame,
  getLiveGames,
  TicketSold,
} from "../controllers/adminGame.controller.js";

const adminGameRouter = Router();

adminGameRouter.get("/live", getLiveGames);
adminGameRouter.get("/ticket", TicketSold);
adminGameRouter.get("/", AllGame);

export default adminGameRouter;
