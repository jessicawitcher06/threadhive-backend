import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createAppError } from "../utils/createAppError.js";

const JWT_EXPIRES_IN = "1h";

const buildAuthResponse = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw createAppError("JWT secret is not configured", 500);
  }

  const token = jwt.sign({ id: user._id, email: user.email }, secret, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createAppError("Email is already registered", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: passwordHash,
  });

  if (!user) {
    throw createAppError("Failed to register user", 500);
  }

  return buildAuthResponse(user);
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createAppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createAppError("Invalid email or password", 401);
  }

  return buildAuthResponse(user);
};
