import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
 import threadRoutes from './routes/threads.js';
import subredditRoutes from "./routes/subreddits.js";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";

// Import models so that they are registered with Mongoose
import "./models/Thread.js";
import "./models/Subreddit.js";
import "./models/User.js";

const app = express();

// Middlewares
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : true;

app.use(limiter);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    limit: "10mb",
    extended: true,
  }),
);

// Routes
 app.use('/api/threads', threadRoutes);
app.use("/api/subreddits", subredditRoutes);
app.use("/api/auth", authLimiter, authRoutes);

app.use(errorHandler);

export default app;
