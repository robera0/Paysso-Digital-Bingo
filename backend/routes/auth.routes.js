import express from "express";
import {
  login,
  logout,
  refresh,
  register,
} from "../controllers/auth.controller.js";
const authRouter = express.Router();

authRouter.post("/signup/user", register);
authRouter.post("/refresh", refresh);
authRouter.post("/login/user", login);
authRouter.post("/logout/user", logout);

export default authRouter;
