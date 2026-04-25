import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import { createAppError } from "../utils/createAppError.js";

dotenv.config();

const authHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createAppError("Authentication token is missing", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw createAppError("Authentication token is missing", 401);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw createAppError("JWT secret is not configured", 500);
    }

    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select("_id name email");
    if (!user) {
      throw createAppError("User not found", 401);
    }

    req.user = {
      id: String(user._id),
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(createAppError("Invalid or expired token", 401));
    }

    return next(error);
  }
};

export default authHandler;
