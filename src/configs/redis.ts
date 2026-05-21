import { Redis } from "ioredis";
import requireEnv from "./env.checker.js";

const connection = new Redis(requireEnv("REDIS_URL"));

export { connection };
