import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import gameRouter from "./routes/gameRoutes.routes.js";
import adminGameRouter from "./routes/admin.route.js";
import authRouter from "./routes/auth.routes.js";
import { ticketRouter, verifyRouter } from "./routes/ticket.routes.js";
import profileRouter from "./routes/profile.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import redis from "./config/redis.js";
import path from "node:path";
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://payssobingo.netlify.app",
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  return /^https:\/\/[a-z0-9-]+--payssobingo\.netlify\.app$/.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`), false);
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.resolve("uploads")));
app.use(cookieParser());
connectDB(app);

app.use("/api/v1", authRouter);
app.use("/api/v1", adminGameRouter);
app.use("/api/v1/game", gameRouter);
app.use("/api/v1/auth", ticketRouter);
app.use("/api/v1/auth", verifyRouter);
app.use("/api/v1/auth", profileRouter);
