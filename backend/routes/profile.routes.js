import express from "express";
import { getUser } from "../controllers/user.controller.js";
import { authenticateTokenMiddleware } from "../middleware/authenticateToken.middleware.js";

const profileRouter = express.Router();

profileRouter.get("/profile", authenticateTokenMiddleware, getUser);

export default profileRouter;
