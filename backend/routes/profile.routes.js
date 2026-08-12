import express from "express";
import { getUser, updateUser } from "../controllers/user.controller.js";
import { authenticateTokenMiddleware } from "../middleware/authenticateToken.middleware.js";

const profileRouter = express.Router();

profileRouter.get("/profile", authenticateTokenMiddleware, getUser);
profileRouter.put("/profile", authenticateTokenMiddleware, updateUser);

export default profileRouter;
