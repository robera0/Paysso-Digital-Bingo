import express from "express";
import connectDB from "./config/db.js";
import gameRouter from "./routes/gameRoutes.routes.js";
import authRouter from "./routes/auth.routes.js";
import ticketRouter from "./routes/ticket.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://payssobingo.netlify.app/api",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
connectDB(app);

app.use("/api/v1", authRouter);
app.use("/api/v1/game", gameRouter);
app.use("/api/v1/auth", ticketRouter);
