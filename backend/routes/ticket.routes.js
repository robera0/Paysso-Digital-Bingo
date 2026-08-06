import express from "express";
import { getTicket } from "../controllers/ticket.controller.js";
import { authenticateTokenMiddleware } from "../middleware/authenticateToken.middleware.js";
import { PurchaseBox } from "../controllers/game.controller.js";

const ticketRouter = express.Router();

ticketRouter.get("/ticket", authenticateTokenMiddleware, getTicket);
ticketRouter.post("/ticket", authenticateTokenMiddleware, PurchaseBox);

export default ticketRouter;
