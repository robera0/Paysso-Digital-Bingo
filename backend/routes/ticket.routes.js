import express from "express";
import { getTicket } from "../controllers/ticket.controller.js";
import { authenticateTokenMiddleware } from "../middleware/authenticateToken.middleware.js";

const ticketRouter = express.Router();

ticketRouter.get("/auth/ticket", authenticateTokenMiddleware, getTicket);

export default ticketRouter;
