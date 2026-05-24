import "dotenv/config";
import { Redis } from "ioredis";
import requireEnv from "./env.checker.js";

const connection = new Redis(requireEnv("REDIS_URL"), {
  maxRetriesPerRequest: null,
});

export { connection };
