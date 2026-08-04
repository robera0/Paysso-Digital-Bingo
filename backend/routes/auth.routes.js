import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { authenticateTokenMiddleware } from "../middleware/authenticateToken.middleware.js";
const authRouter = express.Router();

authRouter.post("/signup/user", register);
authRouter.post("/login/user", login);

export default authRouter;
