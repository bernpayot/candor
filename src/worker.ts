import { Worker } from "bullmq";
import { connection } from "./configs/redis.js";
import { assessmentProcessor } from "./jobs/assessment.processor.js";
import { logger } from "./configs/logger.js";
const worker = new Worker("assessments", assessmentProcessor, {
  connection,
  concurrency: 5,
});

worker.on("completed", (job) => {
  logger.info(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  logger.error(`Job ${job?.id} failed: ${error.message}`);
});
