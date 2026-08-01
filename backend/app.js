import express from "express";
import connectDB from "./config/db.js";
import gameRouter from "./routes/gameRoutes.routes.js";

const app = express();

connectDB(app);

app.use("/api/game", gameRouter);
