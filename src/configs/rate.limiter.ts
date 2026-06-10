import rateLimit from "express-rate-limit";
import { RateLimitError } from "../utils/errors.js";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  handler: (req, res, next) => {
    next(new RateLimitError("Too many requests. Please try again later."));
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === "production" ? 20 : 200,
  handler: (req, res, next) => {
    next(new RateLimitError("Too many requests. Please try again later."));
  },
});
