import dotenv from "dotenv/config";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const authenticateTokenMiddleware = async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};
