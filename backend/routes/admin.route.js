// src/routes/admin/adminGameRouter.ts
import { Router } from "express";
import {
  ActiveUsers,
  getLiveGames,
  TicketSold,
} from "../controllers/adminGame.controller.js";

const adminGameRouter = Router();

adminGameRouter.get("/live", getLiveGames);
adminGameRouter.get("/users", ActiveUsers);
adminGameRouter.get("/ticket", TicketSold);

export default adminGameRouter;
