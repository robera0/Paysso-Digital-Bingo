// src/routes/admin/adminGameRouter.ts
import { Router } from "express";
import { getLiveGames } from "../controllers/adminGame.controller.js";
const adminGameRouter = Router();

adminGameRouter.get("/live", getLiveGames);

export default adminGameRouter;
