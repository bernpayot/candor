import { Queue } from "bullmq";
import { connection } from "../configs/redis.js";

export const assessmentQueue = new Queue("assessments", { connection });
