import express from "express";
import connectDB from "./config/db.js";
import gameRouter from "./routes/gameRoutes.routes.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
connectDB(app);

app.use("/api/game", gameRouter);
app.use("/api", authRouter);
