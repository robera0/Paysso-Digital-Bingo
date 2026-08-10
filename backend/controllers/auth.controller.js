import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "./password.controller.js";
import UserModel from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/token.service.js";

const refreshToken_SECRET = process.env.REFRESH_TOKEN_SECRET;
const isProduction = process.env.NODE_ENV === "production";

export const register = async (req, res) => {
  try {
    const { email, password, phone, fullname, username } = req.body;

    if (!email || !password || !phone || !fullname) {
      return res.status(400).json({
        message: "Email, password, and phone number are required",
      });
    }

    const phonePattern = /^\+2519[0-9]{8}$/;
    if (!phonePattern.test(phone.trim())) {
      return res.status(400).json({
        message: "Please enter a valid phone number (+2519XXXXXXXX)",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await hashPassword(password);

    const newUser = new UserModel({
      email,
      password: hashedPassword,
      phone,
      fullName: fullname,
      username,
      refreshTokens: [],
    });

    const tokenPayload = { id: newUser._id, email: newUser.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    newUser.refreshTokens.push({ token: refreshToken });
    await newUser.save();

    return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      })
      .status(201)
      .json({
        role: newUser.role,
        message: "Account created and logged in successfully",
        user: newUser,
      });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res
        .status(400)
        .json({ message: `An account with this ${field} already exists` });
    }
    res
      .status(500)
      .json({ message: "An unexpected error occurred. Please try again." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Account not found. Please sign up." });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user._id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      })
      .status(200)
      .json({ role: user.role, message: "Logged in successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "An unexpected error occurred during login." });
  }
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "There is no refreshToken" });

  jwt.verify(refreshToken, refreshToken_SECRET, async (error, decoded) => {
    if (error) {
      return res.status(403).json({
        message: "Invalid or expired refresh token",
      });
    }
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const tokenExists = user.refreshTokens.some(
      (t) => t.token === refreshToken,
    );
    if (!tokenExists) {
      return res.status(403).json({ message: "Token mismatch" });
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    const newAccessToken = generateAccessToken(payload);

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 15 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Token refreshed" });
  });
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const user = await UserModel.findOne({
      "refreshTokens.token": refreshToken,
    });

    if (user) {
      user.refreshTokens = user.refreshTokens.filter(
        (t) => t.token !== refreshToken,
      );
      await user.save();
    }

    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      })
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
