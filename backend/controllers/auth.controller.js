import { comparePassword, hashPassword } from "./password.controller.js";
import UserModel from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../service/token.service.js";

const refreshToken_SECRET = process.env.REFRESH_TOKEN_SECRET;
const isProduction = process.env.NODE_ENV === "production";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const existingUser = await UserModel.findOne({ email });
    console.log(existingUser);
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await hashPassword(password);

    const payload = {
      email,
      password: hashedPassword,
    };
    const newUser = await UserModel.create(payload);

    const newPayload = {
      id: newUser._id,
      email: newUser.email,
    };
    const accessToken = generateAccessToken(newPayload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await comparePassword(password, user?.password);

  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const payload = {
    id: user._id,
    email: user.email,
  };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

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
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "their is no refreshToken" });

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

export const logout = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(404).json({ message: "Refresh token is required" });
  }

  const user = await UserService.findByRefreshToken(refreshToken);

  if (!user) {
    return res.status(404).json({ message: "Refresh token is required" });
  }
  user.refreshTokens = user.refreshTokens.filter(
    (t) => t.token !== refreshToken,
  );

  await user.save();

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
};
